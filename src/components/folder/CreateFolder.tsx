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

import Modal from 'components/Modal';
import type { IPCFolder } from 'types/types';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';
import { AiOutlineFolderAdd } from 'react-icons/ai';

const CreateFolder = (): JSX.Element => {
	const { user } = useUserContext();
	const { folders, setFolders, path } = useDriveContext();

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const createFolder = async () => {
		if (!name || name.includes('/')) {
			toast({ title: 'Invalid folder name', status: 'error' });
			return;
		}
		setIsLoading(true);

		const folder: IPCFolder = {
			name,
			path,
			createdAt: Date.now(),
			logs: [{
				action: "Folder created",
				date: Date.now()
			}]
		};

		const created = await user.contact.createFolder(folder);
		toast({ title: created.message, status: created.success ? 'success' : 'error' });
		if (created.success) {
			setFolders([...folders, folder]);
		}

		setIsLoading(false);
		setName('');
		onClose();
	};

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-create-folder-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={AiOutlineFolderAdd}
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
				Create a folder
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Create a folder"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={createFolder}
						isLoading={isLoading}
						id="ipc-dashboard-create-folder-modal-button"
					>
						Create Folder
					</Button>
				}
			>
				<FormControl>
					<FormLabel>Name</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-folder-name"
					/>
				</FormControl>
			</Modal>
		</HStack>
	);
};

export default CreateFolder;
