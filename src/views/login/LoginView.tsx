import { useState } from 'react';

import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

import { useAuthContext } from '../../contexts/auth';
import { useUserContext } from '../../contexts/user';

const LoginView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const [username, setUsername] = useState('');
	const [mnemonics, setMnemonics] = useState('');

	const loginWithMetamask = async (): Promise<void> => {
		const login = await auth.login_with_metamask();

		if (login.user) {
			setUser(login.user);
			// TODO: ajouter retour utilisateur
			console.log('Login success');
		} else {
			// TODO: ajouter retour utilisateur
			console.log('Login failed');
		}
	};

	const loginWithCredentials = async (): Promise<void> => {
		const login = await auth.login_with_credentials(username, mnemonics);

		if (login.user) {
			setUser(login.user);
			// TODO: ajouter retour utilisateur
			console.log('Login success');
		} else {
			// TODO: ajouter retour utilisateur
			console.log('Login failed');
		}
	};

	return (
		<Box>
			<Button onClick={() => loginWithMetamask()}>Login with Metamask</Button>
			<FormControl>
				<FormLabel>Username</FormLabel>
				<Input onChange={(e) => setUsername(e.target.value)} />
				<FormLabel>Mnemonics</FormLabel>
				<Textarea onChange={(e) => setMnemonics(e.target.value)} />
				<Button type="submit" onClick={() => loginWithCredentials()}>
					Login with credentials
				</Button>
			</FormControl>
		</Box>
	);
};

export default LoginView;
