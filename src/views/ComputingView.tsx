import { ChangeEvent, useEffect, useState } from 'react';

import {
	Box,
	VStack,
	Button,
	HStack,
	useDisclosure,
	useToast,
	Input,
	Text,
	Flex,
	Spacer,
	Divider,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import EthCrypto from 'eth-crypto';

import { useUserContext } from 'contexts/user';

import { IPCFile, IPCContact } from 'types/types';

import Modal from 'components/Modal';

import { generateFileKey } from 'utils/generateFileKey';

import { getFileContent, extractFilename } from '../utils/fileManipulation';

import { ResponsiveBarComputing } from '../components/ResponsiveBarComputing';
import { DisplayFileCards } from '../components/DisplayFileCards';

const ComputingView = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);

	useEffect(() => {
		(async () => {
			await loadContact();
			await loadSharedDrive();
		})();
	}, []);

	const loadSharedDrive = async () => {
		try {
			const loadShared = await user.drive.loadShared(user.contact.contacts);
			toast({
				title: loadShared.message,
				status: loadShared.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});
			setFiles(user.drive.files);
			setSharedFiles(user.drive.sharedFiles);
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to load shared drive',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const uploadFile = async () => {
		if (!fileEvent) return;
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();

		if (!filename || !fileContent) return;

		setIsUploadLoading(true);
		try {
			if (user.account) {
				const upload = await user.drive.upload(
					{
						name: filename,
						hash: fileContent,
						created_at: Date.now(),
						key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
					},
					key,
				);
				if (!upload.success) {
					toast({
						title: upload.message,
						status: upload.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
				} else {
					const shared = await user.contact.addFileToContact(
						user.account.address,
						user.drive.files[user.drive.files.length - 1],
					);
					toast({
						title: shared.success ? upload.message : 'Failed to upload the file',
						status: shared.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
				}
			} else {
				toast({
					title: 'Failed to load account',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
			onClose();
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to upload the file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsUploadLoading(false);
	};

	const loadContact = async () => {
		try {
			const load = await user.contact.load();
			toast({
				title: load.message,
				status: load.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});

			setContacts(user.contact.contacts);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Unable to load contacts',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBarComputing
				onOpen={onOpen}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				selectedTab={selectedTab}
			/>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Upload a file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={uploadFile}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-upload-file-modal-button"
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
					id="ipc-dashboardView-upload-file"
				/>
			</Modal>
		</HStack>
	);
};

export default ComputingView;
