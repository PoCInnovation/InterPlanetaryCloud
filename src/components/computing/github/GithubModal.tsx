import { ChangeEvent, useEffect, useState } from 'react';
import { HStack, useToast, Text, VStack, Input, Skeleton, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import Card from 'components/cards/Card';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

import { GitHubRepository, IPCProgram } from 'types/types';

import { textColorMode } from 'config/colorMode';

import CustomProgram from '../CustomProgram';

const GithubModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element => {
	const { user } = useUserContext();
	const { data: session } = useSession();
	const { setPrograms } = useDriveContext();

	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [selectedRepository, setSelectedRepository] = useState<string>('');
	const [customName, setCustomName] = useState<string>('');
	const [customEntrypoint, setCustomEntrypoint] = useState<string>('');
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const [repositoriesLoading, setRepositoriesLoading] = useState(false);
	const [searchInput, setSearchInput] = useState(selectedRepository);

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else if (session) await getRepositories();
		})();
	}, []);

	useEffect(() => {
		const foundRepository = repositories.find((repository) => repository.html_url === selectedRepository);
		if (foundRepository) setSearchInput(`${foundRepository.owner.login} - ${foundRepository.name}`);
		else setSearchInput('');
	}, [selectedRepository]);

	const cloneToBackend = async (repository: string) => {
		try {
			setIsDeployLoading(true);
			const result = await axios.post('/api/program/create', {
				repository: `${repository}.git`,
				entrypoint: customEntrypoint || user.config?.defaultEntrypoint || 'main:app',
			});
			if (result.status !== 200) throw new Error('Unable to clone repository from github');
			const newProgram: IPCProgram = {
				name: customName || result.data.name,
				hash: result.data.item_hash,
				createdAt: Date.now(),
				entrypoint: result.data.entrypoint,
				size: 0,
			};
			user.computing.programs.push(newProgram);
			await user.computing.publishAggregate();
			setPrograms(user.computing.programs);
			toast({ title: 'Upload succeeded', status: 'success' });
			onClose();
		} catch (err) {
			toast({ title: 'Upload failed', status: 'error' });
			console.error(err);
		}
		setIsDeployLoading(false);
		setCustomEntrypoint('');
		setCustomName('');
	};

	const getRepositories = async () => {
		try {
			const repositoryList: GitHubRepository[] = [];
			let hasMore = true;

			setRepositoriesLoading(true);
			for (let i = 1; hasMore; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const result = await axios.get(`/api/computing/github/repositories?page=${i}`);
				if (result.status !== 200) throw new Error("Unable to load repositories from github's API");
				hasMore = result.data.hasMore;
				repositoryList.push(...result.data.repositories);
			}
			setRepositories(repositoryList);
			setRepositoriesLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Deploy from Github"
			CTA={
				<HStack w="100%" spacing="32px">
					<Button
						variant="primary"
						w="100%"
						size="lg"
						onClick={() => {
							cloneToBackend(selectedRepository);
						}}
						isLoading={isDeployLoading}
						disabled={!session}
						id="ipc-dashboard-deploy-from-github-modal-button"
					>
						Deploy a program
					</Button>
					{!session ? (
						<Button
							variant="special"
							size="lg"
							w="100%"
							onClick={() => signIn('github')}
							id="ipc-dashboard-github-signin-button"
						>
							Sign in with Github
						</Button>
					) : (
						<Button
							variant="secondary"
							size="lg"
							w="100%"
							onClick={async () => signOut()}
							id="ipc-dashboard-github-signout-button"
						>
							Sign out from Github
						</Button>
					)}
				</HStack>
			}
		>
			<>
				{!session && (
					<VStack spacing="12px">
						<Text size="xl" color={textColor}>
							You're not connected to your Github account
						</Text>
					</VStack>
				)}
				{session && (
					<>
						<VStack spacing="16px" w="100%" align="start">
							<CustomProgram
								customName={customName}
								setCustomName={setCustomName}
								customEntrypoint={customEntrypoint}
								setCustomEntrypoint={setCustomEntrypoint}
							/>
							<VStack spacing="8px" align="start" w="100%">
								<VStack spacing="8px" align="start" w="100%">
									<HStack>
										<Text size="boldLg" color={textColor}>
											The name of the repository
										</Text>
										<Tooltip text="You need to select a repository from the list below, to deploy your program." />
									</HStack>
									<Input
										value={searchInput}
										onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
									/>
								</VStack>
								<Card w="100%" p="8px">
									<Skeleton isLoaded={!repositoriesLoading} w="100%" borderRadius="8px">
										<VStack h="200px" overflowY="scroll" align="start" spacing="4px" pr="8px" w="100%">
											{repositories
												.filter((repository) =>
													`${repository.owner.login.toLowerCase()} - ${repository.name.toLowerCase()}`.includes(
														searchInput.toLowerCase(),
													),
												)
												.map((repository) => (
													<Text
														p="4px 8px"
														borderRadius="8px"
														w="100%"
														color={textColor}
														_hover={{
															bg: 'blue.100',
														}}
														onClick={() => setSelectedRepository(repository.html_url)}
													>
														{repository.owner.login} - {repository.name}
													</Text>
												))}
										</VStack>
									</Skeleton>
								</Card>
							</VStack>
						</VStack>
					</>
				)}
			</>
		</Modal>
	);
};

export default GithubModal;
