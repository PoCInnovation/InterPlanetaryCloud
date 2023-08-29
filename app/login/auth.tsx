'use client'

import {Text, useColorModeValue, useToast, VStack} from '@chakra-ui/react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

import {useAuthContext} from 'contexts/auth';
import {useConfigContext} from 'contexts/config';
import {useUserContext} from 'contexts/user';

import AuthPage from 'components/AuthPage';
import Button from 'components/Button';

import {ResponseType} from 'types/types';

import {textColorMode} from 'config/colorMode';


const AuthProvider = () => {
    const auth = useAuthContext();
    const {setUser} = useUserContext();
    const router = useRouter();
    const {config} = useConfigContext();

    const [mnemonics, setMnemonics] = useState('');
    const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

    const toast = useToast({duration: 2000, isClosable: true});
    const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

    const loginWithCredentials = async (): Promise<ResponseType> => {
        setIsLoadingCredentials(true);
        const login = await auth.loginWithCredentials(mnemonics, config);
        setIsLoadingCredentials(false);

        if (!login.user) return {success: false, message: login.message};
        setUser(login.user);
        await router.push('/drive');
        await login.user.drive.autoDelete();
        return {success: true, message: login.message};
    };

    const loginWithAProvider = async (): Promise<ResponseType> => {
        setIsLoadingCredentials(true);
        const login = await auth.loginWithProvider(config);
        setIsLoadingCredentials(false);

        if (!login.user) return {success: false, message: login.message};
        setUser(login.user);
        await router.push('/drive');
        await login.user.drive.autoDelete();
        return {success: true, message: login.message};
    };

    return (
        <AuthPage>
            <VStack w="100%" spacing="64px">
                <VStack w="100%" spacing="32px">
                    <VStack spacing="16px" w="100%">
                        <Button
                            variant="primary"
                            size="lg"
                            w="100%"
                            onClick={() =>
                                loginWithCredentials().then((res) =>
                                    toast({status: res.success ? 'success' : 'error', title: res.message}),
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
                    </VStack>
                </VStack>

            </VStack>
        </AuthPage>
    );
}

export default AuthProvider;
