import { Text, Textarea, useColorModeValue, useToast, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAuthContext } from 'contexts/auth';
import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

import AuthPage from 'components/AuthPage';
import Button from 'components/Button';

import { ResponseType } from 'types/types';

import { textColorMode } from 'config/colorMode';
import colors from 'theme/foundations/colors';

const Login = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const router = useRouter();
	const { config } = useConfigContext();

	const [mnemonics, setMnemonics] = useState('');
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

	const toast = useToast({ duration: 2000, isClosable: true });
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	const loginWithCredentials = async (): Promise<ResponseType> => {
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

	const loginWithLedger = async (): Promise<ResponseType> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithLedger(config);
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
						<Text size="boldMd" color={textColor}>
							Coming soon...
						</Text>
						<Button
							variant="primary"
							size="lg"
							w="100%"
							disabled={true}
							onClick={() => loginWithLedger()}
							isLoading={isLoadingCredentials}
							id="ipc-login-provider-button"
						>
							Login with Ledger
						</Button>
						<Text size="boldMd" color={textColor}>
							Coming soon...
						</Text>
					</VStack>
				</VStack>
				<VStack w="100%">
					<Text size="lg" color={textColor}>
						You don't have an account?
					</Text>
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
