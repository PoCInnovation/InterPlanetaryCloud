import { useColorMode, useToast, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import DriveCards from 'components/cards/DriveCards';
import LabelBadge from 'components/LabelBadge';
import Navigation from 'components/navigation/Navigation';

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
		const load = await user.fullContact.contact.load();

		toast({ title: load.message, status: load.success ? 'success' : 'error' });
		setContacts(user.fullContact.contact.contacts);
	};

	const loadUserContents = async () => {
		const loadShared = await user.drive.loadShared(user.fullContact.contact.contacts);
		toast({ title: loadShared.message, status: loadShared.success ? 'success' : 'error' });
		setFiles(user.drive.files);
		setFolders(user.drive.folders);
		setSharedFiles(user.drive.sharedFiles);

		const loadedPrograms = await user.computing.load();
		toast({ title: loadedPrograms.message, status: loadedPrograms.success ? 'success' : 'error' });
		setPrograms(user.computing.programs);

		const loadedConfig = await user.loadConfig();
		setConfig(user.config);
		if (user.config?.theme.value === 'white' && colorMode !== 'light') toggleColorMode();
		if (user.config?.theme.value === 'gray.800' && colorMode !== 'dark') toggleColorMode();
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
