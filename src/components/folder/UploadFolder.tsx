import {
	HStack,
	Icon,
	Input,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { AiFillFolderAdd } from 'react-icons/ai';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import { textColorMode } from 'config/colorMode';
import { IPCFolder } from '../../types/types';
import { getRootFolderName } from '../../utils/fileManipulation';

const UploadFolder = (): JSX.Element => {
	const { user } = useUserContext();
	const { folders, setFolders, path } = useDriveContext();
	const [folderEvent, setFolderEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true, id: 'ipc-upload-folder' });

	const uploadFolder = async () => {
		setIsLoading(true);

		if (!folderEvent || !folderEvent.target.files || folderEvent.target.files.length === 0) {
			setIsLoading(false);
			return;
		}

		const folderName = getRootFolderName(folderEvent.target.files[0]);

		const folder: IPCFolder = {
			name: folderName,
			createdAt: Date.now(),
			path,
			logs: [
				{
					action: 'Folder created',
					date: Date.now(),
				},
			],
		};
		const created = await user.fullContact.folders.create(folder);
		toast({ title: created.message, status: created.success ? 'success' : 'error' });
		if (created.success) {
			setFolders([...folders, folder]);
		}
		setFolderEvent(undefined);
		setIsLoading(false);
		onClose();
	};

	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-upload-folder-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={AiFillFolderAdd}
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
				Upload a folder
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Upload a folder"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={uploadFolder}
						isLoading={isLoading}
						id="ipc-dashboard-upload-folder-modal-button"
					>
						Upload folder
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderEvent(e)}
					id="ipc-dashboard-upload-folder"
					multiple
					// @ts-expect-error Webkitdirectory is needed for the upload of folders in the file explorer.
					webkitdirectory={''}
				/>
			</Modal>
		</HStack>
	);
};

export default UploadFolder;
