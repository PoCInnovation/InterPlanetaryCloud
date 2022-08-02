import { ChangeEvent, useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, HStack, Input, useToast, useDisclosure } from '@chakra-ui/react';
import { FcAdvance } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

import { formatPath, isValidFolderPath } from 'utils/path';

type MoveFileProps = {
	file: IPCFile;
};

const MoveFile = ({ file }: MoveFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => setHasPermission(false);
	}, []);

	const moveFile = async () => {
		setIsLoading(true);
		const formattedPath = formatPath(name);

		if (!isValidFolderPath(formattedPath, user.drive.folders)) {
			toast({ title: 'Invalid path', status: 'error' });
			setIsLoading(false);
			return;
		}

		const moved = await user.contact.moveFile(file, formattedPath);
		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

		const index = files.indexOf(file);
		if (index !== -1) {
			files[index].path = formattedPath;
			setFiles([...files]);
		}
		setName('');
		setIsLoading(false);
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcAdvance size="30"></FcAdvance>{' '}
			<Button
				backgroundColor={'white'}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={() => onOpen()}
				isLoading={isLoading}
				id="ipc-dashboard-move-filebutton"
			>
				Move
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Move file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={moveFile}
						isLoading={isLoading}
						id="ipc-dashboard-move-file-button"
					>
						OK
					</Button>
				}
			>
				<FormControl>
					<FormLabel>Move File</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder={`Current: '${file.path}'`}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-move-file"
					/>
				</FormControl>
			</Modal>
		</HStack>
	);
};

export default MoveFile;
