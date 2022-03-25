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
	Icon,
} from '@chakra-ui/react';
import { CheckIcon, DeleteIcon, DownloadIcon, EditIcon } from '@chakra-ui/icons';

import EthCrypto from 'eth-crypto';

import { useUserContext } from 'contexts/user';

import { IPCFile, IPCContact } from 'types/types';

import Modal from 'components/Modal';
import FileCard from 'components/FileCard';

import { MdPeopleAlt } from 'react-icons/md';
import { generateFileKey } from 'utils/generateFileKey';

import { getFileContent, extractFilename } from '../utils/fileManipulation';

import { ResponsiveBar } from '../components/ResponsiveBar';

const Dashboard = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenContact, onOpen: onOpenContact, onClose: onCloseContact } = useDisclosure();
	const { isOpen: isOpenContactAdd, onOpen: onOpenContactAdd, onClose: onCloseContactAdd } = useDisclosure();
	const { isOpen: isOpenContactUpdate, onOpen: onOpenContactUpdate, onClose: onCloseContactUpdate } = useDisclosure();
	const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure();
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [contactInfos, setContactInfo] = useState<IPCContact>({
		name: '',
		address: '',
		publicKey: '',
		files: [],
	});
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsNameEvent, setContactNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsPublicKeyEvent, setContactPublicKeyEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(
		undefined,
	);
	const [selectedFile, setSelectedFile] = useState<IPCFile>({
		name: '',
		hash: '',
		created_at: 0,
		key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
	});

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

	// Todo imrpove the toast handling
	const uploadFile = async () => {
		if (!fileEvent) return;
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();

		if (!filename || !fileContent) return;

		setIsUploadLoading(true);
		try {
			const upload = await user.drive.upload(
				{
					name: filename,
					hash: fileContent,
					created_at: Date.now(),
					key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
				},
				key,
			);

			if (user.account) {
				const shared = await user.contact.addFileToContact(
					user.account.address,
					user.drive.files[user.drive.files.length - 1],
				);

				if (upload.success && shared.success)
					toast({
						title: upload.message,
						status: upload.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
				else {
					toast({
						title: 'Fail to upload the file',
						status: 'error',
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

	const downloadFile = async (file: IPCFile) => {
		setIsDownloadLoading(true);
		try {
			const download = await user.drive.download(file);
			toast({
				title: download.message,
				status: download.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to download file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsDownloadLoading(false);
	};

	const shareFile = async (contact: IPCContact) => {
		setIsDownloadLoading(true);
		try {
			console.log(selectedFile.key);
			const share = await user.contact.addFileToContact(contact.address, selectedFile);
			onCloseShare();
			toast({
				title: share.message,
				status: share.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			console.log(error);
			toast({
				title: 'Unable to share the file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsDownloadLoading(false);
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

	const addContact = async () => {
		try {
			if (contactsNameEvent && contactsPublicKeyEvent) {
				const add = await user.contact.add({
					name: contactsNameEvent.target.value,
					address: EthCrypto.publicKey.toAddress(contactsPublicKeyEvent.target.value.slice(2)),
					publicKey: contactsPublicKeyEvent.target.value,
					files: [],
				});

				toast({
					title: add.message,
					status: add.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				setContacts(user.contact.contacts);
			} else {
				toast({
					title: 'Bad contact infos',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
			onCloseContactAdd();
		} catch (error) {
			console.log(error);
			toast({
				title: 'Unable to add this contact',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const updateContact = async () => {
		try {
			if (contactsPublicKeyEvent) {
				const update = await user.contact.update(
					contactInfos.address,
					contactsNameEvent ? contactsNameEvent.target.value : contactInfos.name,
				);
				toast({
					title: update.message,
					status: update.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				setContacts(user.contact.contacts);
			} else {
				toast({
					title: 'Invalid address',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
			onCloseContactUpdate();
		} catch (error) {
			console.log(error);
			toast({
				title: 'Unable to update this contact',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const deleteContact = async (contactToDelete: IPCContact) => {
		try {
			const deletedContact = contacts.find((contact) => contact === contactToDelete);

			if (deletedContact) {
				const deleteResponse = await user.contact.remove(contactToDelete.address);

				toast({
					title: deleteResponse.message,
					status: deleteResponse.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				setContacts(user.contact.contacts);
			} else {
				toast({
					title: 'Unable to find this contact',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
			onCloseContact();
		} catch (error) {
			console.log(error);
			toast({
				title: 'Unable to delete this contact',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar onOpen={onOpen} onOpenContact={onOpenContact} isUploadLoading={isUploadLoading} />
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="400px" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
					{files.map((file) => (
						<FileCard key={file.created_at} file={file}>
							<>
								<Button
									variant="inline"
									size="sm"
									onClick={async () => downloadFile(file)}
									isLoading={isDownloadLoading}
									id="ipc-dashboardView-download-button"
								>
									<DownloadIcon />
								</Button>
								<Button
									variant="inline"
									size="sm"
									onClick={() => {
										setSelectedFile(file);
										onOpenShare();
									}}
									isLoading={isDownloadLoading}
									id="ipc-dashboardView-share-button"
								>
									<Icon as={MdPeopleAlt} />
								</Button>
							</>
						</FileCard>
					))}
				</VStack>
			</Box>
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
			<Modal
				isOpen={isOpenContact}
				onClose={onCloseContact}
				title="Contacts"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={onOpenContactAdd}
						id="ipc-dashboardView-contact-modal-button"
					>
						Add Contact
					</Button>
				}
			>
				<VStack spacing="16px" overflowY="auto">
					{contacts.map((contact) => (
						<Flex key={contact.address} w="100%">
							<VStack key={contact.address}>
								<Text fontWeight="600">{contact.name}</Text>
								<Text fontSize="12px">{contact.publicKey}</Text>
							</VStack>
							<Spacer />
							<Button
								p="0px"
								mx="4px"
								onClick={() => {
									setContactInfo(contact);
									onOpenContactUpdate();
								}}
							>
								<EditIcon />
							</Button>
							<Button mx="4px" p="0px" onClick={async () => deleteContact(contact)}>
								<DeleteIcon />
							</Button>
						</Flex>
					))}
				</VStack>
			</Modal>
			<Modal
				isOpen={isOpenContactAdd}
				onClose={onCloseContactAdd}
				title="Add the contact"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={addContact}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-add-contact-button"
					>
						Add the contact
					</Button>
				}
			>
				<>
					<Input
						type="text"
						h="200%"
						w="100%"
						p="10px"
						my="4px"
						placeholder="Name"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactNameEvent(e)}
						id="ipc-dashboardView-input-contact-name"
					/>
					<Input
						type="text"
						h="200%"
						w="100%"
						p="10px"
						my="4px"
						placeholder="Public Key"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactPublicKeyEvent(e)}
						id="ipc-dashboardView-input-contact-public-key"
					/>
				</>
			</Modal>
			<Modal
				isOpen={isOpenContactUpdate}
				onClose={onCloseContactUpdate}
				title="Update the contact"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={updateContact}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-update-contact-button"
					>
						Update the contact
					</Button>
				}
			>
				<>
					<Text>New name *</Text>
					<Input
						type="text"
						h="200%"
						w="100%"
						p="10px"
						my="4px"
						placeholder={contactInfos.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactNameEvent(e)}
						id="ipc-dashboardView-input-contact-name"
					/>
					<Text as="i">* Fill, to update the info</Text>
				</>
			</Modal>
			<Modal
				isOpen={isOpenShare}
				onClose={onCloseShare}
				title="Select your contact"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={addContact}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-share-modal-add-contact-button"
					>
						Add a contact
					</Button>
				}
			>
				<VStack spacing="16px" overflowY="auto">
					{contacts.map((contact) => (
						<Flex key={contact.address} w="100%">
							<VStack key={contact.address}>
								<Text fontWeight="600">{contact.name}</Text>
								<Text fontSize="12px">{contact.address}</Text>
							</VStack>
							<Spacer />
							<Button
								p="0px"
								mx="4px"
								onClick={() => {
									shareFile(contact);
								}}
							>
								<CheckIcon />
							</Button>
						</Flex>
					))}
				</VStack>
			</Modal>
		</HStack>
	);
};

export default Dashboard;
