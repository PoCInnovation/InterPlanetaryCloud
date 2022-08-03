import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, VStack, Button, HStack, useDisclosure, useToast, Input } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import type { IPCFile, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { extractFilename } from 'utils/fileManipulation';

import { ResponsiveBar } from 'components/ResponsiveBar';
import { DisplayCards } from 'components/DisplayCards';
import { useDriveContext } from 'contexts/drive';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { isOpen: isOpenProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useDisclosure();
	const { setFiles, setFolders, setContacts } = useDriveContext();
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
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

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<ResponsiveBar
				onOpenProgram={onOpenProgram}
				setSelectedTab={setSelectedTab}
				isDeployLoading={isDeployLoading}
				selectedTab={selectedTab}
			/>
			<VStack w="100%" m="32px !important">
				<Box w="100%">
					<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
						<DisplayCards
							myPrograms={programs}
							sharedFiles={sharedFiles}
							index={selectedTab}
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
		</HStack>
	);
};

export default Dashboard;
