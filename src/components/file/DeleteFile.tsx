import { Button, HStack, PopoverFooter, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { FcFullTrash } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';
import { useState } from 'react';

type DeleteFileProps = {
	file: IPCFile;
	concernedFiles: IPCFile[];
};

const DeleteFile = ({ file, concernedFiles }: DeleteFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const deleteFile = async () => {
		setIsLoading(true);
		if (user.account) {
			const deleted = await user.drive.delete([file.hash]);
			toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			if (deleted.success) {
				const removed = await user.contact.deleteFiles([file.id], concernedFiles);

				if (!removed.success) {
					toast({ title: removed.message, status: 'error' });
				} else {
					setFiles(user.drive.files);
				}
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		setIsLoading(false);
		onClose();
	};

	const moveToBin = () => {
		file.deletedAt = Date.now();
	};

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<PopoverFooter>
			<HStack>
				<FcFullTrash size="30"></FcFullTrash>
				<Button
					backgroundColor={config?.theme ?? 'white'}
					textColor={colorText}
					w="100%"
					p="0px"
					mx="4px"
					onClick={() => {
						if (!file.deletedAt) {
							moveToBin();
						} else {
							onOpen();
						}
					}}
					isLoading={false}
					id="ipc-dashboard-delete-file-button"
				>
					{file.deletedAt === null ? 'Move to trash' : 'Delete'}
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
							isLoading={isLoading}
							id="ipc-dashboard-delete-file-button"
						>
							Delete
						</Button>
					}
				>
					<Text>Are you sure you want to delete this file ?</Text>
				</Modal>
			</HStack>
		</PopoverFooter>
	);
};

export default DeleteFile;
