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
	FormControl,
	FormLabel,
	FormHelperText,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import EthCrypto from 'eth-crypto';

import { useUserContext } from 'contexts/user';

import { IPCFile, IPCContact } from 'types/types';

import Modal from 'components/Modal';

import { generateFileKey } from 'utils/generateFileKey';

import { getFileContent, extractFilename } from '../utils/fileManipulation';

import { ResponsiveBar } from '../components/ResponsiveBar';
import { DisplayFileCards } from '../components/DisplayFileCards';

const Dashboard = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenContactAdd, onOpen: onOpenContactAdd, onClose: onCloseContactAdd } = useDisclosure();
	const {
		isOpen: isOpenUpdateFileName,
		onOpen: onOpenUpdateFileName,
		onClose: onCloseUpdateFileName,
	} = useDisclosure();
	const { isOpen: isOpenContactUpdate, onOpen: onOpenContactUpdate, onClose: onCloseContactUpdate } = useDisclosure();
	const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure();
	const {
		isOpen: isOpenUpdateFileContent,
		onOpen: onOpenUpdateFileContent,
		onClose: onCloseUpdateFileContent,
	} = useDisclosure();
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [contactInfos, setContactInfo] = useState<IPCContact>({
		name: '',
		address: '',
		publicKey: '',
		files: [],
	});
	const [selectedTab, setSelectedTab] = useState(0);
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);
	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsNameEvent, setContactNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [fileNameEvent, setFileNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
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
				if (!upload.success || !upload.file) {
					toast({
						title: upload.message,
						status: upload.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
				} else {
					user.drive.addIPCFile(upload.file);

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

	const updateFileName = async () => {
		setIsDownloadLoading(true);
		try {
			if (fileNameEvent) {
				const filename = fileNameEvent.target.value;
				const update = await user.contact.updateFileName(selectedFile, filename);
				toast({
					title: update.message,
					status: update.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				if (update.success) {
					const index = files.indexOf(selectedFile);

					if (index !== -1) files[index].name = filename;
					setFiles(files);
				}
				onCloseUpdateFileName();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to change name',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsDownloadLoading(false);
	};

	const updateFileContent = async () => {
		if (!fileEvent || !selectedFile) return;

		const oldFile = selectedFile;

		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();

		if (!fileContent) return;

		const newFile: IPCFile = {
			name: oldFile.name,
			hash: fileContent,
			created_at: Date.now(),
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		};

		setIsUpdateLoading(true);
		try {
			if (user.account) {
				const updateContent = await user.drive.updateFileContent(oldFile, newFile, key);

				if (!updateContent.success || !updateContent.file) {
					toast({
						title: updateContent.message,
						status: updateContent.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
				} else {
					const updated = await user.contact.updateFileContent(updateContent.file, oldFile.hash);
					toast({
						title: updated.success ? updated.message : 'Failed to update the file',
						status: updated.success ? 'success' : 'error',
						duration: 2000,
						isClosable: true,
					});
					if (updated.success && updateContent.file) {
						const index = files.indexOf(oldFile);

						if (index !== -1) files[index] = updateContent.file;
						setFiles(files);
					}
				}
			} else {
				toast({
					title: 'Failed to load account',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
			onCloseUpdateFileContent();
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to update the file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsUpdateLoading(false);
	};

	const shareFile = async (contact: IPCContact) => {
		setIsDownloadLoading(true);
		try {
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
			<ResponsiveBar
				onOpen={onOpen}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				selectedTab={selectedTab}
			/>
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="350px" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
					<DisplayFileCards
						myFiles={files}
						sharedFiles={sharedFiles}
						contacts={contacts}
						index={selectedTab}
						downloadFile={downloadFile}
						isDownloadLoading={isDownloadLoading}
						isUpdateLoading={isUpdateLoading}
						setSelectedFile={setSelectedFile}
						onOpenShare={onOpenShare}
						setContactInfo={setContactInfo}
						onOpenContactUpdate={onOpenContactUpdate}
						onOpenContactAdd={onOpenContactAdd}
						onOpenUpdateFileName={onOpenUpdateFileName}
						onOpenUpdateFileContent={onOpenUpdateFileContent}
						deleteContact={deleteContact}
					/>
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
						w="100%"
						p="10px"
						my="4px"
						placeholder="Name"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactNameEvent(e)}
						id="ipc-dashboardView-input-contact-name"
					/>
					<Input
						type="text"
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
				<FormControl>
					<FormLabel>New name</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder={contactInfos.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactNameEvent(e)}
						id="ipc-dashboardView-input-contact-name"
					/>
				</FormControl>
			</Modal>
			<Modal
				isOpen={isOpenUpdateFileName}
				onClose={onCloseUpdateFileName}
				title="Rename the file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={updateFileName}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-update-filename-button"
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
						placeholder={selectedFile.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFileNameEvent(e)}
						id="ipc-dashboardView-input-update-filename"
					/>
				</FormControl>
			</Modal>
			<Modal
				isOpen={isOpenUpdateFileContent}
				onClose={onCloseUpdateFileContent}
				title="Update file content from a file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={updateFileContent}
						isLoading={isUpdateLoading}
						id="ipc-dashboardView-update-file-content-button"
					>
						Upload new version
					</Button>
				}
			>
				<FormControl>
					<Input
						type="file"
						h="100%"
						w="100%"
						p="10px"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
						id="ipc-dashboardView-input-new-file-content"
					/>
					<FormHelperText as="i">Accepted file format : text</FormHelperText>
				</FormControl>
			</Modal>
			<Modal isOpen={isOpenShare} onClose={onCloseShare} title="Select your contact">
				<VStack spacing="16px" overflowY="auto">
					{contacts.map((contact) => {
						if (user.account && contact.address !== user.account.address)
							return (
								<Flex key={contact.address} w="100%">
									<VStack key={contact.address}>
										<Text fontWeight="600">{contact.name}</Text>
										<Text fontSize="12px">{contact.address}</Text>
									</VStack>
									<Spacer />
									<Button
										p="0px"
										mx="4px"
										variant="inline"
										onClick={async () => {
											await shareFile(contact);
										}}
									>
										<CheckIcon />
									</Button>
								</Flex>
							);
						return <Divider key={contact.address} />;
					})}
				</VStack>
			</Modal>
		</HStack>
	);
};

export default Dashboard;
