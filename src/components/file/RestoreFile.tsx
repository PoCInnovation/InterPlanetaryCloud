import { useState } from 'react';
import { Button, HStack, PopoverFooter, useColorModeValue, useToast } from '@chakra-ui/react';
import {FcRedo} from 'react-icons/fc';

import { useConfigContext } from 'contexts/config';
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
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [isLoading, setIsLoading] = useState(false);

	const restoreFile = async () => {
		setIsLoading(true);
		if (user.account) {
			const moved = await user.contact.moveFileToBin(file, null, concernedFiles)
			toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

			const index = files.indexOf(file);
			if (index !== -1) {
				files[index].deletedAt = null;
				setFiles([...files]);
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		setIsLoading(false);
	};

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<PopoverFooter>
			<HStack>
				<FcRedo size="30"></FcRedo>
				<Button
					backgroundColor={config?.theme ?? 'white'}
					textColor={colorText}
					w="100%"
					p="0px"
					mx="4px"
					onClick={async () => restoreFile()}
					isLoading={isLoading}
					id="ipc-dashboard-restore-file-button"
				>
					Restore
				</Button>
			</HStack>
		</PopoverFooter>
	);
};

export default DeleteFile;
