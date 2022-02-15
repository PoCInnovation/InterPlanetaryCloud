import { ChangeEvent, useEffect, useState } from 'react';

import {
	Box,
	VStack,
	Button,
	HStack,
	useDisclosure,
	useToast,
	Input,
	useBreakpointValue,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	SlideDirection,
	Icon,
	Text,
	Divider,
} from '@chakra-ui/react';
import { DownloadIcon, HamburgerIcon } from '@chakra-ui/icons';

import { useUserContext } from 'contexts/user';

import { IPCFile, IPCContact } from 'types/types';

import Modal from 'components/Modal';
import Sidebar from 'components/SideBar';
import FileCard from 'components/FileCard';
import UploadButton from 'components/UploadButton';
import colors from 'theme/foundations/colors';

const extractFilename = (filepath: string) => {
	const result = /[^\\]*$/.exec(filepath);
	return result && result.length ? result[0] : '';
};

const getFileContent = (file: unknown): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onload = (event: unknown) => {
			// eslint-disable-next-line
			resolve((event as any).target.result);
		};
		reader.onerror = (event) => {
			reject(event);
		};
		reader.readAsText(file as Blob);
	});

const Dashboard = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenContact, onOpen: onOpenContact, onClose: onCloseContact } = useDisclosure();
	const { isOpen: isOpenContactAdd, onOpen: onOpenContactAdd, onClose: onCloseContactAdd } = useDisclosure();
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [contacts, setContact] = useState<IPCContact[]>([]);
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsNameEvent, setContactNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsAddressEvent, setContactAddressEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsPublicKeyEvent, setContactPublicKeyEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(
		undefined,
	);

	useEffect(() => {
		(async () => {
			await loadDrive();
			await loadContact();
		})();
	}, []);

	const loadDrive = async () => {
		try {
			const load = await user.drive.load();
			toast({
				title: load.message,
				status: load.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});
			setFiles(user.drive.files);
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to load drive',
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
		if (!filename || !fileContent) return;

		setIsUploadLoading(true);
		try {
			const upload = await user.drive.upload({
				name: filename,
				content: fileContent,
				created_at: Date.now(),
			});
			toast({
				title: upload.message,
				status: upload.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});
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

	const loadContact = async () => {
		try {
			const load = await user.contact.load();
			toast({
				title: load.message,
				status: load.success ? 'success' : 'error',
				duration: 2000,
				isClosable: true,
			});

			setContact(user.contact.contacts);
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
			if (contactsNameEvent && contactsAddressEvent && contactsPublicKeyEvent) {
				console.log(contactsNameEvent.target.value);
				const add = await user.contact.add({
					name: contactsNameEvent.target.value,
					address: contactsAddressEvent.target.value,
					public_key: contactsPublicKeyEvent.target.value,
				});

				toast({
					title: add.message,
					status: add.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				setContact(user.contact.contacts);
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

	const LeftBar = (): JSX.Element => (
		<Sidebar
			uploadButton={<UploadButton text="Upload a file" onClick={() => onOpen()} isLoading={isUploadLoading} />}
			contactButton={<UploadButton text="Contacts" onClick={() => onOpenContact()} isLoading={isUploadLoading} />}
		/>
	);

	const BarWithDrawer = () => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const { isOpen, onOpen, onClose } = useDisclosure();
		const placement: SlideDirection = 'left';

		return (
			<Box zIndex={100} position="relative" height="80px">
				<Drawer isOpen={isOpen} placement={placement} onClose={onClose}>
					<DrawerOverlay />
					<DrawerContent w="75%">
						<LeftBar />
					</DrawerContent>
				</Drawer>
				<Box as="nav" w="100vw" h="80px" position="fixed" left="0" top="0">
					<HStack w="100%" h="100%" px="24px" py="32px">
						<Button onClick={onOpen} _focus={{}} p="16px" id="ipc-dashboardView-drawer-button" bg="transparent">
							<Icon fontSize="24px" as={HamburgerIcon} />
						</Button>

						<VStack textAlign="center" w="100%">
							<Text
								fontSize={{ base: '16px', sm: '24px' }}
								fontWeight="bold"
								bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
								bgClip="text"
								id="ipc-sideBar-title"
							>
								Inter Planetary Cloud
							</Text>
						</VStack>
					</HStack>
					<Divider />
				</Box>
			</Box>
		);
	};

	const ResponsiveBar = () => {
		const isDrawerNeeded: boolean = useBreakpointValue({ base: true, xs: true, lg: false }) || false;

		if (!isDrawerNeeded) return <LeftBar />;
		return <BarWithDrawer />;
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar />
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="400px" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
					{files.map((file) => (
						<FileCard key={file.created_at} file={file}>
							<Button
								variant="inline"
								size="sm"
								onClick={async () => downloadFile(file)}
								isLoading={isDownloadLoading}
								id="ipc-dashboardView-download-button"
							>
								<DownloadIcon />
							</Button>
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
				<>
					{contacts.map((contact) => (
						<Box key={contact.address}>
							<Text>{contact.name}</Text>
							<Text>{contact.address}</Text>
						</Box>
					))}
				</>
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
						placeholder="Name"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactNameEvent(e)}
						id="ipc-dashboardView-input-contact-name"
					/>
					<Input
						type="text"
						h="200%"
						w="100%"
						p="10px"
						placeholder="Address"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactAddressEvent(e)}
						id="ipc-dashboardView-input-contact-address"
					/>
					<Input
						type="text"
						h="200%"
						w="100%"
						p="10px"
						placeholder="Public Key"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactPublicKeyEvent(e)}
						id="ipc-dashboardView-input-contact-public-key"
					/>
				</>
			</Modal>
		</HStack>
	);
};

export default Dashboard;
