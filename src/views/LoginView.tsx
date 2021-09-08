import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Button, FormControl, FormLabel, Input, Link, Textarea, useToast, VStack } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import OutlineButton from 'components/OutlineButton';

import colors from 'theme/foundations/colors';

const LoginView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const [username, setUsername] = useState('');
	const [mnemonics, setMnemonics] = useState('');
	const [isLoadingMetamask, setIsLoadingMetamask] = useState(false);
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

	const toast = useToast();

	const loginWithMetamask = async (): Promise<void> => {
		setIsLoadingMetamask(true);
		const login = await auth.loginWithMetamask();
		setIsLoadingMetamask(false);

		if (login.user) {
			toast({
				title: login.message,
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			localStorage.setItem('user', JSON.stringify(login.user));
			setUser(login.user);
		} else {
			toast({
				title: login.message,
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const loginWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithCredentials(username, mnemonics);
		setIsLoadingCredentials(false);

		if (login.user) {
			toast({
				title: login.message,
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			localStorage.setItem('user', JSON.stringify(login.user));
			setUser(login.user);
		} else {
			toast({
				title: login.message,
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<VStack spacing="80px" w="496px">
			<VStack spacing="16px" w="100%">
				<Button variant="inline" w="100%" onClick={() => loginWithMetamask()} isLoading={isLoadingMetamask}>
					Login with Metamask
				</Button>
			</VStack>
			<FormControl>
				<FormLabel>Username</FormLabel>
				<Input
					_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<FormLabel mt="8px">Mnemonics</FormLabel>
				<Textarea
					_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
					cursor="text"
					onChange={(e) => setMnemonics(e.target.value)}
				/>
				<Button
					variant="inline"
					mt="16px"
					w="100%"
					type="submit"
					onClick={() => loginWithCredentials()}
					isLoading={isLoadingCredentials}
				>
					Login with credentials
				</Button>
			</FormControl>
			<Link as={RouteLink} to="/signup" w="100%">
				<OutlineButton w="100%" text="Signup" />
			</Link>
		</VStack>
	);
};

export default LoginView;
