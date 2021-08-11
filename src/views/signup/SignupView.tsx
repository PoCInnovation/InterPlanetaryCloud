import React from 'react';

import { Box, Button, FormControl, FormLabel, Input, Link, Text, Textarea } from '@chakra-ui/react';

import { useAuthContext } from '../../contexts/auth';
import { useUserContext } from '../../contexts/user';

const SignupView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const [username, setUsername] = React.useState('');
	const [mnemonics, setMnemonics] = React.useState('Click register to see your mnemonics');

	const signupWithCredentials = async (): Promise<void> => {
		const signup = await auth.signup(username);

		if (signup.user) {
			const returnedMnemonics = signup.user.account?.mnemonics
				? signup.user.account.mnemonics.phrase
				: 'No mnemonics provided';
			setMnemonics(returnedMnemonics);
			setUser(signup.user);
			// TODO: ajouter retour utilisateur
			console.log('Signup success');
		} else {
			// TODO: ajouter retour utilisateur
			console.log('Signup failed');
		}
	};

	return (
		<Box>
			<Text>If you have already metamask, you can login.</Text>
			<Text>If not, you have two solutions:</Text>
			<ul>
				<Text>Install metamastk and login</Text>
				<Text>Signup with credentials</Text>
			</ul>
			<Link href="/login">
				<Button>Login</Button>
			</Link>
			<FormControl>
				<FormLabel>Username</FormLabel>
				<Input onChange={(e) => setUsername(e.target.value)} />
				<FormLabel>Mnemonics</FormLabel>
				<Textarea value={mnemonics} />
				<Button type="submit" onClick={() => signupWithCredentials()}>
					Signup with credentials
				</Button>
			</FormControl>
		</Box>
	);
};

export default SignupView;
