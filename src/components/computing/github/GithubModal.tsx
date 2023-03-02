import { ChangeEvent, useEffect, useState } from 'react';
import { Select, useToast, Text, VStack, HStack } from '@chakra-ui/react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Modal from 'components/Modal';
import Button from 'components/Button';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

import { GitHubRepository, IPCProgram } from 'types/types';
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

	useEffect(() => {
		(async () => {
			if (!user) {
				router.push('/');
			} else if (session) await getRepositories();
		})();
	}, []);

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
			const result = await axios.get('/api/computing/github/repositories');
			if (result.status !== 200) throw new Error("Unable to load repositories from github's API");
			setRepositories(result.data);
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
						</VStack>
					</>
				)}
			</>
		</Modal>
	);
};

export default GithubModal;
