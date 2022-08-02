import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, VStack, Button, HStack, useDisclosure, useToast, Input, FormControl, FormLabel } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import type { IPCFile, IPCFolder, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { generateFileKey } from 'utils/generateFileKey';
import { getFileContent, extractFilename } from 'utils/fileManipulation';

import { ResponsiveBar } from 'components/ResponsiveBar';
import { DisplayCards } from 'components/DisplayCards';
import { useDriveContext } from 'contexts/drive';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useDisclosure();
	const { isOpen: isOpenCreateFolder, onOpen: onOpenCreateFolder, onClose: onCloseCreateFolder } = useDisclosure();
	const { setFiles, folders, setFolders, setContacts } = useDriveContext();
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [path, setPath] = useState('/');
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [isCreateFolderLoading, setIsCreateFolderLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [nameEvent, setNameEvent] = useState('');
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

	const loadContact = async () => {
		const load = await user.contact.load();

		toast({ title: load.message, status: load.success ? 'success' : 'error' });
		setContacts(user.contact.contacts);
	};

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

	const createFolder = async () => {
		setIsCreateFolderLoading(true);
		if (nameEvent) {
			const folder: IPCFolder = {
				name: nameEvent,
				path,
				createdAt: Date.now(),
			};

			const created = await user.contact.createFolder(folder);
			toast({ title: created.message, status: created.success ? 'success' : 'error' });
			if (created.success) {
				setFolders([...folders, folder]);
			}
		}
		setIsCreateFolderLoading(false);
		setNameEvent('');
		onCloseCreateFolder();
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar
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
							myPrograms={programs}
							sharedFiles={sharedFiles}
							index={selectedTab}
							path={path}
							setPath={setPath}
							isRedeployLoading={isDeployLoading}
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
						onChange={(e: ChangeEvent<HTMLInputElement>) => setNameEvent(e.target.value)}
						id="ipc-dashboard-input-folder-name"
					/>
				</FormControl>
			</Modal>
		</HStack>
	);
};

export default Dashboard;
