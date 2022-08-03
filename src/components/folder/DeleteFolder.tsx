import { useDriveContext } from 'contexts/drive';
import { useEffect, useState } from 'react';
import { Button, HStack, Text, useToast, useDisclosure } from '@chakra-ui/react';
import { FcFullTrash } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFolder } from 'types/types';

import { useUserContext } from 'contexts/user';

type DeleteFolderProps = {
	folder: IPCFolder;
};

const DeleteFolder = ({ folder }: DeleteFolderProps): JSX.Element => {
	const { user } = useUserContext();
	const { folders, setFolders, setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const [hasPermission, setHasPermission] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setHasPermission(true);
		return () => setHasPermission(false);
	}, []);

	const deleteFolder = async () => {
		const fullPath = `${folder.path}${folder.name}/`;

		if (user.account) {
			const foldersResponse = await user.contact.deleteFolder(folder);
			setFolders(
				folders.filter(
					(f) => !f.path.startsWith(fullPath) && (f.path !== folder.path || f.createdAt !== folder.createdAt),
				),
			);

			if (foldersResponse.success) {
				const filesToDelete = user.drive.files.filter((file) => file.path.startsWith(fullPath));
				if (filesToDelete.length > 0) {
					const filesResponse = await user.drive.delete(filesToDelete.map((file) => file.hash));
					await user.contact.removeFilesFromContact(
						user.account.address,
						filesToDelete.map((file) => file.hash),
					);
					foldersResponse.success = filesResponse.success;
				}
			}
			toast({ title: foldersResponse.message, status: foldersResponse.success ? 'success' : 'error' });
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		setFiles(user.drive.files);
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcFullTrash size="30"></FcFullTrash>
			<Button
				backgroundColor={'white'}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={() => onOpen()}
				id="ipc-dashboard-delete-folderbutton"
			>
				Delete
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete the folder"
				CTA={
					<Button variant="inline" w="100%" mb="16px" onClick={deleteFolder} id="ipc-dashboard-delete-folder-button">
						Delete
					</Button>
				}
			>
				<Text>Are you sure you want to delete this folder and all it's content ?</Text>
			</Modal>
		</HStack>
	);
};

export default DeleteFolder;
