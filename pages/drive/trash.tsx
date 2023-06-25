import { HStack, VStack } from '@chakra-ui/react';

import DriveCards from 'components/cards/DriveCards';
import DeleteBin from 'components/file/DeleteBin';
import LabelBadge from 'components/LabelBadge';
import Navigation from 'components/navigation/Navigation';

import { useDriveContext } from 'contexts/drive';

const Trash = (): JSX.Element => {
	const { path, files, folders, sharedFiles} = useDriveContext();

	const deletedFiles = files.filter((elem) => elem.path === path && elem.deletedAt !== null);
	const deletedFolders = folders.filter((elem) => elem.path === path);

	return (
		<Navigation>
			<VStack w="100%" spacing="48px" align="start">
				<HStack spacing="48px">
					<LabelBadge label="Trash" />
					<DeleteBin files={deletedFiles} folders={deletedFolders} concernedFiles={sharedFiles} />
				</HStack>
				<DriveCards files={deletedFiles} folders={deletedFolders} />
			</VStack>
		</Navigation>
	);
};

export default Trash;
