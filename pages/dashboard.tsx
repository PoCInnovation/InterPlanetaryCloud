import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import { Box, Button, HStack, Input, Select, useColorMode, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import type { GitHubRepository, IPCFile, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { extractFilename } from 'utils/fileManipulation';

import CustomProgram from 'components/computing/CustomProgram';
import DisplayCards from 'components/DisplayCards';
import { ResponsiveBar } from 'components/navbar/ResponsiveBar';
import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { config, setConfig } = useConfigContext();
	const { colorMode, toggleColorMode } = useColorMode();

	const { isOpen: isOpenGithub, onOpen: onOpenGithub, onClose: onCloseGithub } = useDisclosure();
	const { programs, sharedFiles, setFiles, setFolders, setContacts, setPrograms, setSharedFiles } = useDriveContext();
	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedProgram, setSelectedProgram] = useState<IPCProgram>({
		name: '',
		hash: '',
		createdAt: 0,
		entrypoint: '',
	});
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else {
				await loadContact();
				await loadUserContents();
				if (session) await getRepositories();
			}
		})();
	}, []);

	const loadContact = async () => {
		const load = await user.contact.load();

		toast({ title: load.message, status: load.success ? 'success' : 'error' });
		setContacts(user.contact.contacts);
	};

	const loadUserContents = async () => {
		const loadShared = await user.drive.loadShared(user.contact.contacts);
		toast({ title: loadShared.message, status: loadShared.success ? 'success' : 'error' });
		setFiles(user.drive.files);
		setFolders(user.drive.folders);
		setSharedFiles(user.drive.sharedFiles);

		const loadedPrograms = await user.computing.load();
		toast({ title: loadedPrograms.message, status: loadedPrograms.success ? 'success' : 'error' });
		setPrograms(user.computing.programs);

		const loadedConfig = await user.loadConfig();
		setConfig(user.config);
		if (user.config?.theme === 'white' && colorMode !== 'light') toggleColorMode();
		if (user.config?.theme === 'gray.800' && colorMode !== 'dark') toggleColorMode();
		toast({ title: loadedConfig.message, status: loadedConfig.success ? 'success' : 'error' });
	};

	const getRepositories = async () => {
		try {
			const result = await axios.get('/api/computing/github/repositories');
			if (result.status !== 200) throw new Error("Unable to load repositories from github's API");
			setRepositories(result.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start" bg={config?.theme ?? 'white'}>
			<ResponsiveBar setSelectedTab={setSelectedTab} selectedTab={selectedTab} configTheme={config?.theme ?? 'white'} />
			<VStack w="100%" m="32px !important">
				<Box w="100%">
					<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
						{/* TODO: clear DisplayCardsParams */}
						<DisplayCards
							myPrograms={programs}
							sharedFiles={sharedFiles}
							index={selectedTab}
							isRedeployLoading={false}
							onOpenRedeployProgram={() => {}}
							setSelectedProgram={setSelectedProgram}
						/>
					</VStack>
				</Box>
			</VStack>
		</HStack>
	);
};

export default Dashboard;
