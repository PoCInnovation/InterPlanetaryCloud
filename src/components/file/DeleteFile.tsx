import {
	Button,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';
import { useState } from 'react';
import { IoTrashSharp } from 'react-icons/io5';

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

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

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

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
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
	);
};

export default DeleteFile;
