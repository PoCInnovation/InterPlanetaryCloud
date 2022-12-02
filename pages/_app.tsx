import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { Center, ChakraProvider, ColorModeScript, Spinner, useToast } from '@chakra-ui/react';

import theme from 'theme';
import 'theme/index.css';

import Auth from 'lib/auth';
import User from 'lib/user';

import { IPCConfig, IPCContact, IPCFile, IPCFolder, IPCProgram } from 'types/types';

import AuthContext from 'contexts/auth';
import ConfigContext from 'contexts/config';
import DriveContext from 'contexts/drive';
import UserContext from 'contexts/user';

const App = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<{
	session: Session;
}>) => {
	const [auth, setAuth] = useState<Auth | undefined>(undefined);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [config, setConfig] = useState<IPCConfig | undefined>(undefined);
	const [error, setError] = useState<Error | unknown>(undefined);
	const [files, setFiles] = useState<IPCFile[]>([]);
	const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
	const [folders, setFolders] = useState<IPCFolder[]>([]);
	const [programs, setPrograms] = useState<IPCProgram[]>([]);
	const [contacts, setContacts] = useState<IPCContact[]>([]);
	const [path, setPath] = useState('/');
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
				<Spinner w="64px" h="64px" />
			</Center>
		);
	}
	return (
		<>
			<Head>
				<title>InterPlanetaryCloud</title>
				<meta
					name="description"
					content="A distributed cloud built on top of Aleph, the next generation network of distributed big data applications."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta charSet="UTF-8" />
				<link rel="icon" href="/ipc-logo.svg" />
			</Head>
			<ChakraProvider theme={theme} resetCSS>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<AuthContext.Provider value={auth}>
					<UserContext.Provider value={{ user: user as User, setUser }}>
						<ConfigContext.Provider value={{ config: config as IPCConfig, setConfig }}>
							<DriveContext.Provider
								value={{
									files,
									setFiles,
									sharedFiles,
									setSharedFiles,
									folders,
									setFolders,
									programs,
									setPrograms,
									contacts,
									setContacts,
									path,
									setPath,
								}}
							>
								<SessionProvider session={session}>
									<Component {...pageProps} />
								</SessionProvider>
							</DriveContext.Provider>
						</ConfigContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</ChakraProvider>
		</>
	);
};

export default App;
