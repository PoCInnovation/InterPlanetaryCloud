import { ChangeEvent, useState, useEffect } from 'react';
import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	useToast,
	useDisclosure,
	useColorModeValue,
} from '@chakra-ui/react';
import { FcEditImage } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';
import { useConfigContext } from 'contexts/config';

type RenameFileProps = {
	file: IPCFile;
};

const RenameFile = ({ file }: RenameFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => setHasPermission(false);
	}, []);

	const renameFile = async () => {
		setIsLoading(true);
		if (name) {
			const update = await user.contact.updateFileName(file, name);
			toast({ title: update.message, status: update.success ? 'success' : 'error' });
			if (update.success) {
				const index = files.indexOf(file);

				if (index !== -1) files[index].name = name;
				setFiles(files);
			}
		}
		setName('');
		setIsLoading(false);
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcEditImage size="30"></FcEditImage>
			<Button
				backgroundColor={config?.theme ?? 'white'}
				textColor={colorText}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={() => onOpen()}
				isLoading={isLoading}
				id="ipc-dashboard-update-filename-button"
			>
				Rename
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Rename the file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={renameFile}
						isLoading={isLoading}
						id="ipc-dashboard-update-filename-button"
					>
						OK
					</Button>
				}
			>
				<FormControl>
					<FormLabel>New file name</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder={file.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-update-filename"
					/>
				</FormControl>
			</Modal>
		</HStack>
	);
};

export default RenameFile;
