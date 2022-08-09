import { useState, useEffect } from 'react';
import { Button, HStack, Text, useToast, useDisclosure } from '@chakra-ui/react';
import { FcFullTrash } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

type DeleteFileProps = {
	file: IPCFile;
};

const DeleteFile = ({ file }: DeleteFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const [hasPermission, setHasPermission] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => setHasPermission(false);
	}, []);

	const deleteFile = async () => {
		if (user.account) {
			const deleted = await user.drive.delete([file.hash]);

			toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			if (deleted.success) {
				const removed = await user.contact.removeFilesFromContact(user.account.address, [file.hash]);

				if (!removed.success) {
					toast({ title: removed.message, status: 'error' });
				} else {
					setFiles(user.drive.files);
				}
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
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
				isLoading={false}
				id="ipc-dashboard-delete-file-button"
			>
				Delete
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete the file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={async () => deleteFile()}
						id="ipc-dashboard-delete-file-button"
					>
						Delete
					</Button>
				}
			>
				<Text>Are you sure you want to delete this file ?</Text>
			</Modal>
		</HStack>
	);
};

export default DeleteFile;