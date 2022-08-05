import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

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
	Select,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import EthCrypto from 'eth-crypto';

import { useUserContext } from 'contexts/user';

import type { IPCFile, IPCContact, IPCProgram, GitHubRepository } from 'types/types';

import Modal from 'components/Modal';

import { generateFileKey } from 'utils/generateFileKey';

import { getFileContent, extractFilename } from 'utils/fileManipulation';

import { ResponsiveBar } from 'components/ResponsiveBar';
import { DisplayFileCards } from 'components/DisplayFileCards';

import { useSession, signIn, signOut } from 'next-auth/react';

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
	const { isOpen: isOpenContactUpdate, onOpen: onOpenContactUpdate, onClose: onCloseContactUpdate } = useDisclosure();
	const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure();
	const { isOpen: isOpenProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useDisclosure();
	const { isOpen: isOpenGithub, onOpen: onOpenGithub, onClose: onCloseGithub } = useDisclosure();
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
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
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [isGithubLoading] = useState(false);
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
	const [selectedProgram, setSelectedProgram] = useState<IPCProgram>({
		name: '',
		hash: '',
		created_at: 0,
	});
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const [selectedRepository, setSelectedRepository] = useState<string>('');
	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else {
				await loadContact();
				await loadUserContents();
				await getRepositories();
			}
		})();
	}, []);

	const loadUserContents = async () => {
		try {
			const loadShared = await user.drive.loadShared(user.contact.contacts);
			toast({ title: loadShared.message, status: loadShared.success ? 'success' : 'error' });
			setFiles(user.drive.files);
			setSharedFiles(user.drive.sharedFiles);

			const loadedPrograms = await user.computing.loadPrograms();
			toast({ title: loadedPrograms.message, status: loadedPrograms.success ? 'success' : 'error' });
			setPrograms(user.computing.programs);
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to load shared drive', status: 'error' });
		}
	};

	const getRepositories = async () => {
		try {
			const result = await axios.get('/api/computing/github/repositories');
			if (result.status !== 200) throw new Error("Unable to load repositories from Github's API");
			setRepositories(result.data);
		} catch (error) {
			console.error(error);
		}
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
					created_at: Date.now(),
				},
				fileEvent.target.files[0],
				!!oldProgram,
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
			onClose();
			return;
		}

		const file: IPCFile = {
			name: filename,
			hash: fileContent,
			created_at: Date.now(),
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		};
		setIsUploadLoading(true);
		try {
			if (user.account) {
				const upload = await user.drive.upload(file, key);
				if (!upload.success || !upload.file) {
					toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
				} else {
					user.drive.files.push(upload.file);

					const shared = await user.contact.addFileToContact(
						user.account.address,
						user.drive.files[user.drive.files.length - 1],
					);
					toast({ title: upload.message, status: shared.success ? 'success' : 'error' });
				}
			} else {
				toast({ title: 'Failed to load account', status: 'error' });
			}
			onClose();
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to upload the file', status: 'error' });
		}
		setFileEvent(undefined);
		setIsUploadLoading(false);
	};

	const updateFileName = async () => {
		try {
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
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to change name', status: 'error' });
		}
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
			created_at: oldFile.created_at,
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		};
		setIsUpdateLoading(true);
		try {
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
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to update the file', status: 'error' });
		}
		setIsUpdateLoading(false);
	};

	const shareFile = async (contact: IPCContact) => {
		try {
			const share = await user.contact.addFileToContact(contact.address, selectedFile);
			onCloseShare();
			toast({ title: share.message, status: share.success ? 'success' : 'error' });
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to share the file', status: 'error' });
		}
	};

	const loadContact = async () => {
		try {
			const load = await user.contact.load();
			toast({ title: load.message, status: load.success ? 'success' : 'error' });

			setContacts(user.contact.contacts);
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to load contacts', status: 'error' });
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

				toast({ title: add.message, status: add.success ? 'success' : 'error' });
				setContacts(user.contact.contacts);
			} else {
				toast({ title: 'Bad contact infos', status: 'error' });
			}
			onCloseContactAdd();
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to add this contact', status: 'error' });
		}
	};

	const updateContact = async () => {
		try {
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
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to update this contact', status: 'error' });
		}
	};

	const cloneToBackend = async (repository: string) => {
		console.log(`${repository}.git`);
		axios
			.post('/api/program/create', {
				repository: `${repository}.git`,
			})
			.then(() => {
				toast({ title: 'Upload succeeded', status: 'success' });
				onCloseGithub();
			})
			.catch((e) => {
				toast({ title: 'Upload failed', status: 'error' });
				console.error(e);
			});
	};

	const deleteContact = async (contactToDelete: IPCContact) => {
		try {
			const deletedContact = contacts.find((contact) => contact === contactToDelete);

			if (deletedContact) {
				const deleteResponse = await user.contact.remove(contactToDelete.address);

				toast({ title: deleteResponse.message, status: deleteResponse.success ? 'success' : 'error' });
				setContacts(user.contact.contacts);
			} else {
				toast({ title: 'Unable to find this contact', status: 'error' });
			}
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to delete this contact', status: 'error' });
		}
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar
				onOpen={onOpen}
				onOpenProgram={onOpenProgram}
				onOpenGithub={onOpenGithub}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				isDeployLoading={isDeployLoading}
				isGithubLoading={isGithubLoading}
				selectedTab={selectedTab}
			/>
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="350px" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
					<DisplayFileCards
						myFiles={files}
						myPrograms={programs}
						sharedFiles={sharedFiles}
						contacts={contacts}
						index={selectedTab}
						isUpdateLoading={isUpdateLoading}
						setSelectedFile={setSelectedFile}
						onOpenShare={onOpenShare}
						setContactInfo={setContactInfo}
						onOpenContactUpdate={onOpenContactUpdate}
						onOpenContactAdd={onOpenContactAdd}
						onOpenUpdateFileName={onOpenUpdateFileName}
						onOpenUpdateFileContent={onOpenUpdateFileContent}
						deleteContact={deleteContact}
						isRedeployLoading={isDeployLoading}
						onOpenRedeployProgram={onOpenProgram}
						setSelectedProgram={setSelectedProgram}
					/>
				</VStack>
			</Box>
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
				isOpen={isOpenGithub}
				onClose={onCloseGithub}
				title="Deploy from Github"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={() => {
							console.log(`url:${selectedRepository}`);
							cloneToBackend(selectedRepository);
						}}
						isLoading={isDeployLoading}
						id="ipc-dashboard-deploy-from-github-modal-button"
					>
						Deploy program
					</Button>
				}
			>
				<>
					{!session && (
						<Button variant="inline" w="100%" onClick={() => signIn('github')} id="ipc-dashboard-github-signin-button">
							Sign in with Github
						</Button>
					)}
					{session && (
						<>
							<VStack spacing="5%">
								<Select
									onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedRepository(e.target.value)}
									placeholder="Select repository"
								>
									{repositories.map((repository, index: number) => (
										<option key={index} value={repository.html_url}>
											{repository.name}
										</option>
									))}
								</Select>
								<Button
									variant="inline"
									w="100%"
									onClick={async () => signOut()}
									id="ipc-dashboard-github-signout-button"
								>
									Sign out
								</Button>
							</VStack>
						</>
					)}
				</>
			</Modal>
			*{' '}
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
