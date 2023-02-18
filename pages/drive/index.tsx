import { useEffect } from 'react';
import { useColorMode, useToast, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';
import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';

import DriveCards from 'components/cards/DriveCards';
import Navigation from 'components/navigation/Navigation';
import LabelBadge from 'components/LabelBadge';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const { colorMode, toggleColorMode } = useColorMode();

	const { path, folders, files, setFiles, setFolders, setContacts, setPrograms, setSharedFiles } = useDriveContext();

	useEffect(() => {
		(async () => {
			if (user) {
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
			<VStack w="100%" spacing="48px" align="start">
				<LabelBadge label="My drive" />
				<DriveCards
					files={files.filter((elem) => elem.path === path && !elem.deletedAt)}
					folders={folders.filter((elem) => elem.path === path)}
				/>
			</VStack>
		</Navigation>
	);
};

export default Dashboard;
