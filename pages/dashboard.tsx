import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import EthCrypto from 'eth-crypto';

import { useUserContext } from 'contexts/user';

import type { IPCFile, IPCFolder, IPCContact, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { generateFileKey } from 'utils/generateFileKey';
import { getFileContent, extractFilename } from 'utils/fileManipulation';
import { formatPath, isValidFolderPath } from 'utils/path';

import { ResponsiveBar } from 'components/ResponsiveBar';
import { DisplayCards } from 'components/DisplayCards';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenContactAdd, onOpen: onOpenContactAdd, onClose: onCloseContactAdd } = useDisclosure();
	const {
		isOpen: isOpenUpdateFileName,
		onOpen: onOpenUpdateFileName,
		onClose: onCloseUpdateFileName,
	} = useDisclosure();
	const { isOpen: isOpenDeleteFile, onOpen: onOpenDeleteFile, onClose: onCloseDeleteFile } = useDisclosure();
	const { isOpen: isOpenMoveFile, onOpen: onOpenMoveFile, onClose: onCloseMoveFile } = useDisclosure();
	const { isOpen: isOpenContactUpdate, onOpen: onOpenContactUpdate, onClose: onCloseContactUpdate } = useDisclosure();
	const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure();
	const { isOpen: isOpenProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useDisclosure();
	const { onOpen: onOpenElem } = useDisclosure();
	const {
		isOpen: isOpenUpdateFileContent,
		onOpen: onOpenUpdateFileContent,
		onClose: onCloseUpdateFileContent,
	} = useDisclosure();
	const { isOpen: isOpenCreateFolder, onOpen: onOpenCreateFolder, onClose: onCloseCreateFolder } = useDisclosure();
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [folders, setFolders] = useState<IPCFolder[]>([]);
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [contactInfos, setContactInfo] = useState<IPCContact>({
		name: '',
		address: '',
		publicKey: '',
		files: [],
		folders: [],
	});
	const [selectedTab, setSelectedTab] = useState(0);
	const [path, setPath] = useState('/');
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const [isCreateFolderLoading, setIsCreateFolderLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsNameEvent, setContactNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [fileNameEvent, setFileNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [folderNameEvent, setFolderNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [newPath, setNewPath] = useState('');
	const [contactsPublicKeyEvent, setContactPublicKeyEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(
		undefined,
	);
	const [selectedFile, setSelectedFile] = useState<IPCFile>({
		name: '',
		hash: '',
		size: 0,
		createdAt: 0,
		key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		path: '/',
	});
	const [selectedProgram, setSelectedProgram] = useState<IPCProgram>({
		name: '',
		hash: '',
		createdAt: 0,
	});

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else {
				await loadContact();
				await loadUserContents();
			}
		})();
	}, []);

	const loadUserContents = async () => {
		const loadShared = await user.drive.loadShared(user.contact.contacts);
		toast({ title: loadShared.message, status: loadShared.success ? 'success' : 'error' });
		setFiles(user.drive.files);
		setFolders(user.drive.folders);
		setSharedFiles(user.drive.sharedFiles);

		const loadedPrograms = await user.computing.load();
		toast({ title: loadedPrograms.message, status: loadedPrograms.success ? 'success' : 'error' });
		setPrograms(user.computing.programs);
	};

	const uploadProgram = async (oldProgram: IPCProgram | undefined) => {
		if (!fileEvent || !fileEvent.target.files) return;
		const filename = extractFilename(fileEvent.target.value);

		if (!filename) return;

		setIsDeployLoading(true);
		try {
			const upload = await user.computing.uploadProgram(
				{
					name: filename,
					hash: '',
					createdAt: Date.now(),
				},
				fileEvent.target.files[0],
				oldProgram,
			);
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
			setPrograms(user.computing.programs);
			onCloseProgram();
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to upload file', status: 'error' });
		}
		setFileEvent(undefined);
		setIsDeployLoading(false);
	};

	const uploadFile = async () => {
		if (!fileEvent) return;
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();
		if (!filename || !fileContent) {
			toast({ title: 'Invalid file', status: 'error' });
			setFileEvent(undefined);
			setIsUploadLoading(false);
			return;
		}

		const file: IPCFile = {
			name: filename,
			hash: fileContent,
			size: fileEvent.target.files![0].size,
			createdAt: Date.now(),
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
			path,
		};

		setIsUploadLoading(true);
		if (user.account) {
			const upload = await user.drive.upload(file, key);
			if (!upload.success || !upload.file) {
				toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
			} else {
				user.drive.files.push(upload.file);

				const shared = await user.contact.addFileToContact(user.account.address, upload.file);
				toast({ title: upload.message, status: shared.success ? 'success' : 'error' });
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		onClose();
		setFileEvent(undefined);
		setIsUploadLoading(false);
	};

	const deleteFile = async () => {
		if (user.account) {
			const deleted = await user.drive.delete(selectedFile.hash);

			toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			if (deleted.success) {
				const removed = await user.contact.removeFileFromContact(user.account.address, selectedFile);

				if (!removed.success) {
					toast({ title: removed.message, status: 'error' });
				} else {
					setFiles(user.drive.files.filter((file) => file.hash !== selectedFile.hash));
				}
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		onCloseDeleteFile();
	};

	const updateFileName = async () => {
		if (fileNameEvent) {
			const filename = fileNameEvent.target.value;
			const update = await user.contact.updateFileName(selectedFile, filename);
			toast({ title: update.message, status: update.success ? 'success' : 'error' });
			if (update.success) {
				const index = files.indexOf(selectedFile);

				if (index !== -1) files[index].name = filename;
				setFiles(files);
			}
			onCloseUpdateFileName();
		}
	};

	const moveFile = async () => {
		const formattedPath = formatPath(newPath);

		if (!isValidFolderPath(formattedPath, user.drive.folders)) {
			toast({ title: 'Invalid path', status: 'error' });
			return;
		}

		const moved = await user.contact.moveFile(selectedFile, formattedPath);

		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

		const index = files.indexOf(selectedFile);
		if (index !== -1) {
			files[index].path = formattedPath;
			setFiles(files);
		}
		onCloseMoveFile();
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
			size: oldFile.size,
			createdAt: oldFile.createdAt,
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
			path: oldFile.path,
		};
		setIsUpdateLoading(true);
		const upload = await user.drive.upload(newFile, key);
		if (!upload.success || !upload.file) {
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
		} else {
			const updated = await user.contact.updateFileContent(upload.file, oldFile.hash);
			toast({ title: updated.message, status: updated.success ? 'success' : 'error' });
			if (updated.success && upload.file) {
				const index = files.indexOf(oldFile);
				if (index !== -1) files[index] = upload.file;
				setFiles(files);

				const deleted = await user.drive.delete(oldFile.hash);
				toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			}
		}
		onCloseUpdateFileContent();
		setIsUpdateLoading(false);
	};

	const shareFile = async (contact: IPCContact) => {
		const share = await user.contact.addFileToContact(contact.address, selectedFile);

		onCloseShare();
		toast({ title: share.message, status: share.success ? 'success' : 'error' });
	};

	const loadContact = async () => {
		const load = await user.contact.load();

		toast({ title: load.message, status: load.success ? 'success' : 'error' });
		setContacts(user.contact.contacts);
	};

	const addContact = async () => {
		if (contactsNameEvent && contactsPublicKeyEvent) {
			const add = await user.contact.add({
				name: contactsNameEvent.target.value,
				address: EthCrypto.publicKey.toAddress(contactsPublicKeyEvent.target.value.slice(2)),
				publicKey: contactsPublicKeyEvent.target.value,
				files: [],
				folders: [],
			});

			toast({ title: add.message, status: add.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
		} else {
			toast({ title: 'Bad contact infos', status: 'error' });
		}
		onCloseContactAdd();
	};

	const updateContact = async () => {
		if (contactsPublicKeyEvent) {
			const update = await user.contact.update(
				contactInfos.address,
				contactsNameEvent ? contactsNameEvent.target.value : contactInfos.name,
			);
			toast({ title: update.message, status: update.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
		} else {
			toast({ title: 'Invalid address', status: 'error' });
		}
		onCloseContactUpdate();
	};

	const deleteContact = async (contactToDelete: IPCContact) => {
		const deletedContact = contacts.find((contact) => contact === contactToDelete);

		if (deletedContact) {
			const deleteResponse = await user.contact.remove(contactToDelete.address);

			toast({ title: deleteResponse.message, status: deleteResponse.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
		} else {
			toast({ title: 'Unable to find this contact', status: 'error' });
		}
	};

	const createFolder = async () => {
		setIsCreateFolderLoading(true);
		if (folderNameEvent) {
			const name = folderNameEvent.target.value;

			const folder: IPCFolder = {
				name,
				path,
				createdAt: Date.now(),
			};

			const created = await user.contact.createFolder(folder);
			toast({ title: created.message, status: created.success ? 'success' : 'error' });
			if (created.success) {
				setFolders([...folders, folder]);
			}
			onCloseCreateFolder();
		}
		setIsCreateFolderLoading(false);
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar
				onOpenElem={onOpenElem}
				onOpen={onOpen}
				onOpenProgram={onOpenProgram}
				onOpenCreateFolder={onOpenCreateFolder}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				isDeployLoading={isDeployLoading}
				isCreateFolderLoading={isCreateFolderLoading}
				selectedTab={selectedTab}
			/>
			<VStack w="100%" m="32px !important">
				<Box w="100%">
					<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
						<DisplayCards
							myFiles={files}
							myFolders={folders}
							myPrograms={programs}
							sharedFiles={sharedFiles}
							contacts={contacts}
							index={selectedTab}
							path={path}
							setPath={setPath}
							isUpdateLoading={isUpdateLoading}
							onOpenMoveFile={onOpenMoveFile}
							setSelectedFile={setSelectedFile}
							onOpenShare={onOpenShare}
							setContactInfo={setContactInfo}
							onOpenContactUpdate={onOpenContactUpdate}
							onOpenContactAdd={onOpenContactAdd}
							onOpenUpdateFileName={onOpenUpdateFileName}
							onOpenUpdateFileContent={onOpenUpdateFileContent}
							deleteContact={deleteContact}
							isRedeployLoading={isDeployLoading}
							onOpenDeleteFile={onOpenDeleteFile}
							onOpenRedeployProgram={onOpenProgram}
							setSelectedProgram={setSelectedProgram}
						/>
					</VStack>
				</Box>
			</VStack>
			<Modal
				isOpen={isOpenProgram}
				onClose={onCloseProgram}
				title="Deploy a program"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={() => uploadProgram(selectedProgram)}
						isLoading={isDeployLoading}
						id="ipc-dashboard-deploy-program-modal-button"
					>
						Deploy program
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-deploy-program"
				/>
			</Modal>
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
			<Modal
				isOpen={isOpenCreateFolder}
				onClose={onCloseCreateFolder}
				title="Create a folder"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={createFolder}
						isLoading={isCreateFolderLoading}
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
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFolderNameEvent(e)}
						id="ipc-dashboard-input-folder-name"
					/>
				</FormControl>
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
						id="ipc-dashboard-add-contact-button"
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
						id="ipc-dashboard-input-contact-name"
					/>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder="Public Key"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactPublicKeyEvent(e)}
						id="ipc-dashboard-input-contact-public-key"
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
						id="ipc-dashboard-update-contact-button"
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
						id="ipc-dashboard-input-contact-name"
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
						placeholder={selectedFile.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFileNameEvent(e)}
						id="ipc-dashboard-input-update-filename"
					/>
				</FormControl>
			</Modal>
			<Modal
				isOpen={isOpenDeleteFile}
				onClose={onCloseDeleteFile}
				title="Delete the file"
				CTA={
					<Button variant="inline" w="100%" mb="16px" onClick={deleteFile} id="ipc-dashboard-delete-file-button">
						Delete
					</Button>
				}
			>
				<Text>Are you sure you want to delete this file ?</Text>
			</Modal>
			<Modal
				isOpen={isOpenMoveFile}
				onClose={onCloseMoveFile}
				title="Move file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={moveFile}
						isLoading={isUploadLoading}
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
						placeholder={`Current: '${selectedFile.path}'`}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPath(e.target.value)}
						id="ipc-dashboard-input-move-file"
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
						id="ipc-dashboard-update-file-content-button"
					>
						Upload new version
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-input-new-file-content"
				/>
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
