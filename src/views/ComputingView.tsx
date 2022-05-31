import { ChangeEvent, useEffect, useState } from 'react';

import { Box, VStack, Button, HStack, useDisclosure, useToast, Input, Text } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import { IPCContact, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { DisplayProgramCards } from 'components/DisplayProgramCards';
import { extractFilename, getFileContent } from 'utils/fileManipulation';
import { ResponsiveBarComputing } from '../components/ResponsiveBarComputing';

const ComputingView = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenContactUpdate, onOpen: onOpenContactUpdate, onClose: onCloseContactUpdate } = useDisclosure();
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [contactInfos, setContactInfo] = useState<IPCContact>({
		name: '',
		address: '',
		publicKey: '',
		files: [],
	});
	const [selectedTab, setSelectedTab] = useState(0);
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsNameEvent, setContactNameEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [contactsPublicKeyEvent, setContactPublicKeyEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(
		undefined,
	);
	const [selectedFile, setSelectedFile] = useState<IPCProgram>({
		name: '',
		hash: '',
		created_at: 0,
	});

	useEffect(() => {
		(async () => {
			await loadContact();
			await loadPrograms();
		})();
	}, []);

	const loadPrograms = async () => {
		try {
			if (user.account) {
				const loadedPrograms = await user.computing.loadPrograms();
				toast({
					title: loadedPrograms.message,
					status: loadedPrograms.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				setPrograms(user.computing.programs);
			} else {
				toast({
					title: 'Failed to load account',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
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

	const loadContact = async (): Promise<void> => {
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

	const uploadFile = async () => {
		if (!fileEvent || !fileEvent.target.files) return;
		const filename = extractFilename(fileEvent.target.value);

		if (!filename) return;

		setIsUploadLoading(true);
		try {
			if (user.account) {
				const upload = await user.computing.uploadProgram(
					{
						name: filename,
						hash: '',
						created_at: Date.now(),
					},
					fileEvent.target.files[0],
				);
				toast({
					title: upload.message,
					status: upload.success ? 'success' : 'error',
					duration: 2000,
					isClosable: true,
				});
				if (upload.success) {
					setPrograms(user.computing.programs);
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
				title: 'Unable to upload file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsUploadLoading(false);
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBarComputing
				onOpen={onOpen}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				selectedTab={selectedTab}
			/>
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="350px" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
					<DisplayProgramCards
						myPrograms={programs}
						contacts={contacts}
						index={selectedTab}
						setContactInfo={setContactInfo}
						onOpenContactUpdate={onOpenContactUpdate}
					/>
				</VStack>
			</Box>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Deploy a program"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={uploadFile}
						isLoading={isUploadLoading}
						id="ipc-dashboardView-upload-file-modal-button"
					>
						Deploy a program
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
