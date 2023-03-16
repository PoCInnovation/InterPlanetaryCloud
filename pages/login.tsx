import { Text, Textarea, useToast, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button, FormControl, Text, Textarea, useToast, VStack, useColorMode } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

import AuthPage from 'components/AuthPage';
import Button from 'components/Button';

import { ResponseType } from 'types/types';

import colors from 'theme/foundations/colors';

const Login = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const router = useRouter();
	const { config } = useConfigContext();

	const [mnemonics, setMnemonics] = useState('');
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

	const toast = useToast({ duration: 2000, isClosable: true });

	const {colorMode} = useColorMode();

	const loginWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithCredentials(mnemonics, config);
		setIsLoadingCredentials(false);

		if (!login.user) return { success: false, message: login.message };
		setUser(login.user);
		await router.push('/drive');
		await login.user.drive.autoDelete();
		return { success: true, message: login.message };
	};

	const loginWithAProvider = async (): Promise<ResponseType> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithProvider(config);
		setIsLoadingCredentials(false);

		if (!login.user) return { success: false, message: login.message };
		setUser(login.user);
		await router.push('/drive');
		await login.user.drive.autoDelete();
		return { success: true, message: login.message };
	};

	return (
		<AuthPage>
			<VStack w="100%" spacing="64px">
				<VStack w="100%" spacing="32px">
					<VStack spacing="16px" w="100%">
						<Textarea
							_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
							cursor="text"
							onChange={(e) => setMnemonics(e.target.value)}
							id="ipc-login-text-area"
						/>
						<Button
							variant="primary"
							size="lg"
							w="100%"
							onClick={() =>
								loginWithCredentials().then((res) =>
									toast({ status: res.success ? 'success' : 'error', title: res.message }),
								)
							}
							isLoading={isLoadingCredentials}
							id="ipc-login-credentials-button"
						>
							Login with credentials
						</Button>
					</VStack>
					<VStack w="100%">
						<Button
							variant="primary"
							size="lg"
							w="100%"
							disabled={true}
							onClick={() => loginWithAProvider()}
							isLoading={isLoadingCredentials}
							id="ipc-login-provider-button"
						>
							Login with a provider
						</Button>
<<<<<<< Updated upstream
						<Text size="boldMd">Coming soon...</Text>
=======
					</VStack> */}
					<VStack w="100%">
						<Text color={colorMode} fontSize="14px">Create an account</Text>
						<Link href="/signup">
							<div style={{ width: '100%' }}>
								<OutlineButton configTheme={config?.theme} w="100%" text="Signup" id="ipc-login-signup-button" />
							</div>
						</Link>
>>>>>>> Stashed changes
					</VStack>
				</VStack>
				<VStack w="100%">
					<Text size="lg">You don't have an account?</Text>
					<Link href="/signup">
						<Button
							variant="secondary"
							size="lg"
							w="100%"
							onClick={() => router.push('/signup')}
							id="ipc-login-signup-button"
						>
							Create an account
						</Button>
					</Link>
				</VStack>
			</VStack>
		</AuthPage>
	);
};

export default Login;
