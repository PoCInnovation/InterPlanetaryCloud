import { Button } from '@chakra-ui/react';
import type { IPCFolder } from 'types/types';

type DeleteFolderButtonProps = {
	folder: IPCFolder;
	isUpdateLoading: boolean;
	setSelectedFolder: (file: IPCFolder) => void;
	onOpenDeleteFolder: () => void;
};

const DeleteFolderButton = ({
	folder,
	isUpdateLoading,
	setSelectedFolder,
	onOpenDeleteFolder,
}: DeleteFolderButtonProps): JSX.Element => (
	<Button
		backgroundColor={'white'}
		justifyContent="flex-start"
		w="100%"
		p="0px"
		mx="4px"
		onClick={async () => {
			setSelectedFolder(folder);
			onOpenDeleteFolder();
		}}
		isLoading={isUpdateLoading}
		id="ipc-dashboard-delete-folderbutton"
	>
		Delete
	</Button>
);

export default DeleteFolderButton;
