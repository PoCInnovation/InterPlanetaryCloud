import { HStack, Icon, Text, useBreakpointValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoTrashSharp } from 'react-icons/io5';

import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import type { IPCFolder } from 'types/types';

type DeleteFolderProps = {
	folder: IPCFolder;
};

const DeleteFolder = ({ folder }: DeleteFolderProps): JSX.Element => {
	const { user } = useUserContext();
	const { folders, setFolders, setFiles } = useDriveContext();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
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
					await user.contact.deleteFiles(
						filesToDelete.map((file) => file.id),
						[],
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
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-delete-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={IoTrashSharp}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize="16px"
				fontWeight="400"
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
			>
				Delete
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete the folder"
				CTA={
					<Button variant="primary" size="lg" onClick={deleteFolder} id="ipc-dashboard-delete-folder-button">
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
