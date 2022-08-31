import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, FormControl, Text, Textarea, useToast, VStack } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import OutlineButton from 'components/OutlineButton';
import AuthPage from 'components/AuthPage';

import colors from 'theme/foundations/colors';

const Login = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const router = useRouter();

	const [mnemonics, setMnemonics] = useState('');
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

	const toast = useToast({ duration: 2000, isClosable: true });

	const loginWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithCredentials(mnemonics);
		setIsLoadingCredentials(false);

		if (login.user) {
			toast({ title: login.message, status: 'success' });
			setUser(login.user);
			router.push('/dashboard');
		} else {
			toast({ title: login.message, status: 'error' });
		}
	};

	return (
		<AuthPage
			children={
				<VStack spacing={{ base: '48px', md: '56px', lg: '64px' }} w="100%">
					<FormControl>
						<Textarea
							_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
							cursor="text"
							onChange={(e) => setMnemonics(e.target.value)}
							id="ipc-login-text-area"
						/>
						<Button
							variant="inline"
							mt="16px"
							w="100%"
							type="submit"
							onClick={() => loginWithCredentials()}
							isLoading={isLoadingCredentials}
							id="ipc-login-credentials-button"
						>
							Login with credentials
						</Button>
					</FormControl>
					<VStack w="100%">
						<Text fontSize="14px">Create an account</Text>
						<Link href="/signup">
							<div style={{ width: '100%' }}>
								<OutlineButton w="100%" text="Signup" id="ipc-login-signup-button" />
							</div>
						</Link>
					</VStack>
				</VStack>
			}
		/>
	);
};

export default Login;
