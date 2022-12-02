import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Box, HStack, useColorMode, useToast, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

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

	const { sharedFiles, setFiles, setFolders, setContacts, setPrograms, setSharedFiles } = useDriveContext();
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else {
				await loadContact();
				await loadUserContents();
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

	return (
		<HStack minH="100vh" minW="100vw" align="start" bg={config?.theme ?? 'white'}>
			<ResponsiveBar setSelectedTab={setSelectedTab} selectedTab={selectedTab} configTheme={config?.theme ?? 'white'} />
			<VStack w="100%" m="32px !important">
				<Box w="100%">
					<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
						{/* TODO: clear DisplayCardsParams */}
						<DisplayCards
							sharedFiles={sharedFiles}
							index={selectedTab}
							isRedeployLoading={false}
							onOpenRedeployProgram={() => {}}
						/>
					</VStack>
				</Box>
			</VStack>
		</HStack>
	);
};

export default Dashboard;
