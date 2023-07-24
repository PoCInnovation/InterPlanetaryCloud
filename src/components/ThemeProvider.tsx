'use client';

import Auth from 'lib/auth';
import {useEffect, useState} from 'react';
import {ChakraProvider, ColorModeScript, useToast} from '@chakra-ui/react';
import theme from 'theme';
import AuthContext from 'contexts/auth';
import User from 'lib/user';
import ConfigContext from 'contexts/config';
import {IPCConfig, IPCContact, IPCFile, IPCFolder, IPCProgram} from 'types/types';
import UserContext from '../contexts/user';
import DriveContext from '../contexts/drive';

export default function ThemProvider({children}: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<Auth | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [config, setConfig] = useState<IPCConfig | undefined>(undefined);
    const [error, setError] = useState<Error | unknown>(undefined);
    const toast = useToast();
    const [files, setFiles] = useState<IPCFile[]>([]);
    const [sharedFiles, setSharedFiles] = useState<IPCFile[]>([]);
    const [folders, setFolders] = useState<IPCFolder[]>([]);
    const [programs, setPrograms] = useState<IPCProgram[]>([]);
    const [sharedPrograms, setSharedPrograms] = useState<IPCProgram[]>([]);
    const [contacts, setContacts] = useState<IPCContact[]>([]);
    const [path, setPath] = useState('/');

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
    return (
        <ChakraProvider theme={theme} resetCSS cssVarsRoot="body">
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <AuthContext.Provider value={auth}>
                <UserContext.Provider value={{user: user as User, setUser}}>
                    <ConfigContext.Provider value={{config: config as IPCConfig, setConfig}}>
                        <DriveContext.Provider
                            value={{
                                files,
                                setFiles,
                                sharedFiles,
                                setSharedFiles,
                                folders,
                                setFolders,
                                sharedPrograms,
                                setSharedPrograms,
                                programs,
                                setPrograms,
                                contacts,
                                setContacts,
                                path,
                                setPath,
                            }}
                        >
                            {children}
                        </DriveContext.Provider>
                    </ConfigContext.Provider>
                </UserContext.Provider>
            </AuthContext.Provider>
        </ChakraProvider>
    );
}
