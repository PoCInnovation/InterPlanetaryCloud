import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	PopoverBody,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

import { ChangeEvent, useState } from 'react';
import { FcEditImage } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type RenameFileProps = {
	file: IPCFile;
};

const RenameFile = ({ file }: RenameFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

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

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<PopoverBody>
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
		</PopoverBody>
	);
};

export default RenameFile;
