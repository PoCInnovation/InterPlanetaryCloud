import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	Input,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

import { ChangeEvent, useState } from 'react';
import { BsPencil } from 'react-icons/bs';

import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFile } from 'types/types';

type RenameFileProps = {
	file: IPCFile;
	concernedFiles: IPCFile[];
	onClosePopover: () => void;
};

const RenameFile = ({ file, concernedFiles, onClosePopover }: RenameFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const renameFile = async () => {
		setIsLoading(true);
		if (name) {
			const update = await user.contact.updateFileName(file, name, concernedFiles);
			toast({ title: update.message, status: update.success ? 'success' : 'error' });
			if (update.success) {
				const index = files.indexOf(file);

				if (index !== -1) {
					files[index].name = name;
					files[index].logs.push({
						action: `Renamed file to ${name}`,
						date: Date.now()
					})
				}
				setFiles([...files]);
			}
		}
		setName('');
		setIsLoading(false);
		onClose();
		onClosePopover();
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
			id="ipc-dashboard-rename-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={BsPencil}
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
				Rename
			</Text>
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
