import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import { Box, Button, HStack, Input, Select, useColorMode, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import type { GitHubRepository, IPCFile, IPCProgram } from 'types/types';

import Modal from 'components/Modal';

import { extractFilename } from 'utils/fileManipulation';

import CustomProgram from 'components/computing/CustomProgram';
import { DisplayCards } from 'components/DisplayCards';
import { ResponsiveBar } from 'components/ResponsiveBar';
import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';

const Dashboard = (): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const { user } = useUserContext();
	const { config, setConfig } = useConfigContext();
	const { colorMode, toggleColorMode } = useColorMode();
	const { isOpen: isOpenProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useDisclosure();
	const { isOpen: isOpenGithub, onOpen: onOpenGithub, onClose: onCloseGithub } = useDisclosure();
	const { setFiles, setFolders, setContacts } = useDriveContext();
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [isGithubLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [selectedProgram, setSelectedProgram] = useState<IPCProgram>({
		name: '',
		hash: '',
		createdAt: 0,
		entrypoint: '',
	});
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const [selectedRepository, setSelectedRepository] = useState<string>('');
	const [customName, setCustomName] = useState<string>('');
	const [customEntrypoint, setCustomEntrypoint] = useState<string>('');
	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else {
				await loadContact();
				await loadUserContents();
				if (session) await getRepositories();
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

		const loadedConfig = await user.loadConfig();
		setConfig(user.config);
		console.log(user.config);
		if (user.config?.theme === 'white' && colorMode !== 'light') toggleColorMode();
		if (user.config?.theme === 'gray.800' && colorMode !== 'dark') toggleColorMode();
		toast({ title: loadedConfig.message, status: loadedConfig.success ? 'success' : 'error' });
	};

	const uploadProgram = async (oldProgram: IPCProgram | undefined) => {
		if (!fileEvent || !fileEvent.target.files) return;
		const filename = extractFilename(fileEvent.target.value);
		if (!filename) return;

		setIsDeployLoading(true);
		try {
			const upload = await user.computing.uploadProgram(
				{
					name: customName || filename,
					hash: '',
					createdAt: Date.now(),
					entrypoint: customEntrypoint || user.config?.defaultEntrypoint || 'main:app',
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

	const getRepositories = async () => {
		try {
			const result = await axios.get('/api/computing/github/repositories');
			if (result.status !== 200) throw new Error("Unable to load repositories from Github's API");
			setRepositories(result.data);
		} catch (error) {
			console.error(error);
		}
	};

	const cloneToBackend = async (repository: string) => {
		try {
			setIsDeployLoading(true);
			const result = await axios.post('/api/program/create', {
				repository: `${repository}.git`,
				entrypoint: customEntrypoint || user.config?.defaultEntrypoint || 'main:app',
			});
			if (result.status !== 200) throw new Error('Unable to clone repository from Github');
			const newProgram: IPCProgram = {
				name: customName || result.data.name,
				hash: result.data.item_hash,
				createdAt: Date.now(),
				entrypoint: result.data.entrypoint,
			};
			user.computing.programs.push(newProgram);
			await user.computing.publishAggregate();
			setPrograms(user.computing.programs);
			toast({ title: 'Upload succeeded', status: 'success' });
			onCloseGithub();
		} catch (err) {
			toast({ title: 'Upload failed', status: 'error' });
			console.error(err);
		}
		setIsDeployLoading(false);
		setCustomEntrypoint('');
		setCustomName('');
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start" bg={config?.theme ?? 'white'}>
			<ResponsiveBar
				onOpenProgram={onOpenProgram}
				onOpenGithub={onOpenGithub}
				setSelectedTab={setSelectedTab}
				isDeployLoading={isDeployLoading}
				isGithubLoading={isGithubLoading}
				selectedTab={selectedTab}
				configTheme={config?.theme ?? 'white'}
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
				<>
					<CustomProgram
						customName={customName}
						setCustomName={setCustomName}
						customEntrypoint={customEntrypoint}
						setCustomEntrypoint={setCustomEntrypoint}
					/>
					<Input
						type="file"
						h="100%"
						w="100%"
						p="10px"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
						id="ipc-dashboard-deploy-program"
					/>
				</>
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
								<CustomProgram
									customName={customName}
									setCustomName={setCustomName}
									customEntrypoint={customEntrypoint}
									setCustomEntrypoint={setCustomEntrypoint}
								/>
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
		</HStack>
	);
};

export default Dashboard;
