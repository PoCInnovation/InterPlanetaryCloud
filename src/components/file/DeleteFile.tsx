import {
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoTrashSharp } from 'react-icons/io5';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DeleteFileProps = {
	file: IPCFile;
	concernedFiles: IPCFile[];
	onClosePopover: () => void;
};

const DeleteFile = ({ file, concernedFiles, onClosePopover }: DeleteFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();

	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	const deleteFile = async () => {
		setIsLoading(true);
		if (user.account) {
			const deleted = await user.drive.delete([file.hash]);
			toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			if (deleted.success) {
				const removed = await user.fullContact.files.delete([file.id], concernedFiles);

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

	const moveToBin = async (deletedAt: number) => {
		setIsLoading(true);
		if (user.account) {
			const moved = await user.fullContact.files.moveToBin(file, deletedAt, concernedFiles);
			toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

			const index = files.indexOf(file);
			if (index !== -1) {
				files[index].deletedAt = deletedAt;
				files[index].logs.push({
					action: 'Moved file to bin',
					date: Date.now(),
				});
				setFiles([...files]);
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		setIsLoading(false);
	};

	const onBinClicked = async () => {
		if (!file.deletedAt) {
			await moveToBin(Date.now());
		} else {
			onOpen();
		}
		onClosePopover();
	};

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onBinClicked}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-delete-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
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
				color={textColor}
			>
				{file.deletedAt ? 'Delete' : 'Move to bin'}
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete the file"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={async () => deleteFile()}
						isLoading={isLoading}
						id="ipc-dashboard-delete-file-button"
					>
						Delete
					</Button>
				}
			>
				<Text color={textColor}>Are you sure you want to delete this file?</Text>
			</Modal>
		</HStack>
	);
};

export default DeleteFile;
