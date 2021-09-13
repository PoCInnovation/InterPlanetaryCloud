import { useEffect, useState } from 'react';

import { Center, Spinner, useToast } from '@chakra-ui/react';

import User from 'lib/user';
import Auth from 'lib/auth';

import UserContext from 'contexts/user';
import AuthContext from 'contexts/auth';

import Routes from './Routes';

const App = (): JSX.Element => {
	const [auth, setAuth] = useState<Auth | undefined>(undefined);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [error, setError] = useState<Error | undefined>(undefined);
	const toast = useToast();

	useEffect(() => {
		if (!auth && !error) {
			try {
				setAuth(new Auth());
			} catch (e) {
				setError(e);
			}
		}
	}, []);

	useEffect(() => {
		if (error) {
			toast({
				title: 'Internal Server Error',
				status: 'error',
				isClosable: true,
			});
		}
	}, [error]);

	if (!auth) {
		return (
			<Center mt="160px">
				<Spinner w="160px" />
			</Center>
		);
	}

	return (
		<>
			<AuthContext.Provider value={auth}>
				<UserContext.Provider value={{ user: user as User, setUser }}>
					<Routes />
				</UserContext.Provider>
			</AuthContext.Provider>
		</>
	);
};

export default App;
