import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
	Box,
	HStack,
	Popover,
	useColorMode,
	useToast,
	VStack,
	Button,
	PopoverHeader,
	PopoverFooter,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	PopoverBody,
} from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import DisplayCards from 'components/cards/DisplayCards';
import { ResponsiveBar } from 'components/navigation/ResponsiveBar';
import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import {BsFileEarmarkFill, BsPlusLg} from 'react-icons/bs';
import CreateFolder from 'components/folder/CreateFolder';
import DeployProgram from 'components/computing/programs/DeployProgram';
import UploadFile from 'components/file/UploadFile';
import DeployGithub from 'components/computing/github/DeployGithub';
import DriveCards from '../../src/components/cards/DriveCards';
import Navigation from '../../src/components/navigation/Navigation';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { config, setConfig } = useConfigContext();
	const { colorMode, toggleColorMode } = useColorMode();

	const { path, folders, files, sharedFiles, setFiles, setFolders, setContacts, setPrograms, setSharedFiles } =
		useDriveContext();
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
		<Navigation>
			<VStack m="32px !important">
				<Box w="100%">
					<VStack w="100%" id="test" spacing="16px">
						{/* TODO: clear DisplayCardsParams */}
						<DriveCards
							files={files.filter((elem) => elem.path === path && !elem.deletedAt)}
							folders={folders.filter((elem) => elem.path === path)}
						/>
					</VStack>
				</Box>
			</VStack>
		</Navigation>
	);
};

export default Dashboard;
