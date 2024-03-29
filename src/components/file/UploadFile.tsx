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
import { AiOutlineFileAdd } from 'react-icons/ai';

import { extractFilename, getFileContent } from 'utils/fileManipulation';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import { textColorMode } from 'config/colorMode';
import type { IPCFile } from 'types/types';

const UploadFile = (): JSX.Element => {
	const { user } = useUserContext();
	const { path, files, setFiles } = useDriveContext();

	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true, id: 'ipc-upload-file' });

	const uploadFile = async () => {
		if (!fileEvent) return;
		setIsLoading(true);
		const fileName = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);

		if (!fileName || !fileContent) {
			toast({ title: 'Invalid file', status: 'error' });
			setFileEvent(undefined);
			setIsLoading(false);
		} else {
			const cryptoKey = await crypto.subtle.generateKey(
				{
					name: 'AES-GCM',
					length: 256,
				},
				true,
				['encrypt', 'decrypt'],
			);

			const keyString = await crypto.subtle.exportKey('raw', cryptoKey);
			const iv = crypto.getRandomValues(new Uint8Array(128));

			const file: IPCFile = {
				id: crypto.randomUUID(),
				name: fileName,
				hash: '',
				size: fileEvent.target.files![0].size,
				createdAt: Date.now(),
				encryptInfos: { key: '', iv: '' },
				path,
				permission: 'owner',
				deletedAt: null,
				logs: [
					{
						action: 'File created',
						date: Date.now(),
					},
				],
			};

			if (user.account) {
				const upload = await user.drive.upload(file, fileContent, { key: keyString, iv });
				if (!upload.success || !upload.file)
					toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
				else {
					setFiles([...files, upload.file]);
					user.drive.files.push(upload.file);

					const shared = await user.fullContact.files.addToContact(user.account.address, upload.file);
					toast({ title: upload.message, status: shared.success ? 'success' : 'error' });
				}
			} else toast({ title: 'Failed to load account', status: 'error' });
			onClose();
			setFileEvent(undefined);
			setIsLoading(false);
		}
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
			id="ipc-dashboard-upload-file-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={AiOutlineFileAdd}
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
				Upload a file
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Upload a file"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={uploadFile}
						isLoading={isLoading}
						id="ipc-dashboard-upload-file-modal-button"
					>
						Upload file
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-upload-file"
				/>
			</Modal>
		</HStack>
	);
};

export default UploadFile;
