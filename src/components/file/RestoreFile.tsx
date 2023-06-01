import { HStack, Icon, Text, useBreakpointValue, useToast, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { BiUndo } from 'react-icons/bi';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFile } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DeleteFileProps = {
	file: IPCFile;
	concernedFiles: IPCFile[];
	onClose: () => void;
};

const DeleteFile = ({ file, concernedFiles, onClose }: DeleteFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	const restoreFile = async () => {
		if (user.account) {
			const moved = await user.fullContact.contact.moveFileToBin(file, null, concernedFiles);
			toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

			const index = files.indexOf(file);
			if (index !== -1) {
				files[index].deletedAt = null;
				files[index].logs.push({
					action: 'Restored file',
					date: Date.now(),
				});
				setFiles([...files]);
				onClose();
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
	};

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={() => restoreFile()}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-download-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={BiUndo}
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
				Restore the file
			</Text>
		</HStack>
	);
};

export default DeleteFile;
