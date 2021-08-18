import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Button, FormControl, FormLabel, Input, Link, Textarea, useToast, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';
import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

const SignupView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const [username, setUsername] = React.useState('');
	const [mnemonics, setMnemonics] = React.useState('Click register to see your mnemonics');
	const toast = useToast();

	const signupWithMetamask = async (): Promise<void> => {
		const login = await auth.loginWithMetamask();

		if (login.user) {
			setUser(login.user);
			toast({
				title: 'Welcome back !',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} else {
			toast({
				title: 'Unable to signup with metamask',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const signupWithCredentials = async (): Promise<void> => {
		const signup = await auth.signup(username);

		if (signup.user) {
			const returnedMnemonics = signup.user.account?.mnemonics
				? signup.user.account.mnemonics.phrase
				: 'No mnemonics provided.';
			setMnemonics(returnedMnemonics);
			setUser(signup.user);
			toast({
				title: 'Welcome !',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} else {
			toast({
				title: 'Please try again',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<VStack spacing="80px" w="496px">
			<VStack spacing="16px" w="100%">
				<Button variant="inline" onClick={() => signupWithMetamask()} w="100%">
					Signup with metamask
				</Button>
			</VStack>
			{/* TODO: ajouter un lien vers metamask */}
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
					value={mnemonics}
					readOnly
				/>
				{/* TODO: ajouter un button pour copier le mnemonics */}
				<Button variant="inline" mt="16px" w="100%" type="submit" onClick={() => signupWithCredentials()}>
					Signup with credentials
				</Button>
			</FormControl>
			<Link as={RouteLink} to="/login" w="100%">
				<Button variant="outline" size="sm" w="100%">
					Login
				</Button>
			</Link>
		</VStack>
	);
};

export default SignupView;
