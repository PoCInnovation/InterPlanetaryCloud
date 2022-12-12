import { HStack, Icon, Text, useBreakpointValue, useToast } from '@chakra-ui/react';
import { BiUndo } from 'react-icons/bi';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFile } from 'types/types';

type DeleteFileProps = {
	file: IPCFile;
	concernedFiles: IPCFile[];
};

const DeleteFile = ({ file, concernedFiles }: DeleteFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const restoreFile = async () => {
		if (user.account) {
			const moved = await user.contact.moveFileToBin(file, null, concernedFiles)
			toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

			const index = files.indexOf(file);
			if (index !== -1) {
				files[index].deletedAt = null;
				files[index].logs.push({
					action: "Restored file",
					date: Date.now()
				})
				setFiles([...files]);
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
				bg: 'blue.100',
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
			>
				Restore the file
			</Text>
		</HStack>
	);
};

export default DeleteFile;
