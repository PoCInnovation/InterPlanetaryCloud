import { ChangeEvent, useEffect, useState } from 'react';
import { Button, HStack, Select, useToast, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Modal from 'components/Modal';
import Button from 'components/Button';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

import { GitHubRepository, IPCProgram } from 'types/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import CustomProgram from '../CustomProgram';

const GithubModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element => {
	const { user } = useUserContext();
	const { data: session } = useSession();
	const { setPrograms } = useDriveContext();

	const toast = useToast({ duration: 2000, isClosable: true });
	const router = useRouter();

	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [selectedRepository, setSelectedRepository] = useState<string>('');
	const [customName, setCustomName] = useState<string>('');
	const [customEntrypoint, setCustomEntrypoint] = useState<string>('');
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const [selectedPage, setSelectedPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else if (session) await getRepositories();
		})();
	}, []);

	useEffect(() => {
		(async () => {
			await getRepositories();
		})();
	}, [selectedPage]);

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
			const result = await axios.get(`/api/computing/github/repositories?page=${selectedPage}`);
			if (result.status !== 200) throw new Error("Unable to load repositories from github's API");
			setHasMore(result.data.hasMore);
			setRepositories(result.data.repositories);
			toast({
				title: 'Repositories loaded',
				status: 'success',
			});
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
				<HStack w="100%" justify="space-between">
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
							onClick={() => signIn('github')}
							id="ipc-dashboard-github-signin-button"
						>
							Sign in with Github
						</Button>
					) : (
						<Button
							variant="secondary"
							size="lg"
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
						<Text size="xl">You're not connected to your Github account</Text>
					</VStack>
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
							<VStack w="100%">
								<HStack justify="space-between" w="100%">
									<Text>Dont see your repository?</Text>
									<HStack spacing="16px">
										<ChevronLeftIcon
											cursor={selectedPage > 1 ? 'pointer' : 'not-allowed'}
											onClick={() => setSelectedPage(selectedPage === 1 ? 1 : selectedPage - 1)}
										/>
										<Text>{selectedPage}</Text>
										<ChevronRightIcon
											cursor={hasMore ? 'pointer' : 'not-allowed'}
											onClick={() => setSelectedPage(hasMore ? selectedPage + 1 : selectedPage)}
										/>
									</HStack>
								</HStack>
								<Select
									onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedRepository(e.target.value)}
									placeholder="Select repository"
								>
									{repositories.map((repository, index: number) => (
										<option key={index} value={repository.html_url}>
											{repository.owner.login} - {repository.name}
										</option>
									))}
								</Select>
							</VStack>
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
	);
};

export default GithubModal;
