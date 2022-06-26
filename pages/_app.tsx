import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

import { ChakraProvider, Center, Spinner, useToast } from '@chakra-ui/react';

import theme from 'theme';
import 'theme/index.css';

import User from 'lib/user';
import Auth from 'lib/auth';

import UserContext from 'contexts/user';
import AuthContext from 'contexts/auth';

const App = ({ Component, pageProps }: AppProps) => {
	const [auth, setAuth] = useState<Auth | undefined>(undefined);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [error, setError] = useState<Error | unknown>(undefined);
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
			<Head>
				<title>InterPlanerataryCloud</title>
				<meta
					name="description"
					content="A distributed cloud built on top of Aleph, the next generation network of distributed big data applications."
				/>
				<link rel="icon" href="/ipc-logo.svg" />
			</Head>
			<ChakraProvider theme={theme} resetCSS>
				<AuthContext.Provider value={auth}>
					<UserContext.Provider value={{ user: user as User, setUser }}>
						<Component {...pageProps} />
					</UserContext.Provider>
				</AuthContext.Provider>
			</ChakraProvider>
		</>
	);
};

export default App;
