'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';

import {Text, Textarea, useColorModeValue, useToast, VStack} from '@chakra-ui/react';

import {useAuthContext} from 'contexts/auth';
import {useConfigContext} from 'contexts/config';
import {useUserContext} from 'contexts/user';

import AuthPage from 'components/AuthPage';
import Button from 'components/Button';

import {ResponseType} from 'types/types';

import {textColorMode} from 'config/colorMode';
import colors from 'theme/foundations/colors';

const Signup = (): JSX.Element => {
    const auth = useAuthContext();
    const {setUser} = useUserContext();
    const {setConfig} = useConfigContext();
    const router = useRouter();

    const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
    const [mnemonics, setMnemonics] = useState('');

    const toast = useToast({duration: 2000, isClosable: true});
    const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

    const signupWithMnemonics = async (): Promise<ResponseType> => {
        setIsLoadingCredentials(true);

        const signup = await auth.signup();

        setIsLoadingCredentials(false);
        if (!signup.user || !signup.user.account) return {success: false, message: signup.message};
        if (!signup.mnemonic)
            return {
                success: false,
                message: 'We could not generate your mnemonics. Please try again.',
            };
        setMnemonics(signup.mnemonic);
        setUser(signup.user);
        setConfig(signup.user.config);
        return {success: true, message: signup.message};
    };

    const onClick = () => {
        if (!mnemonics)
            signupWithMnemonics().then((res) => toast({title: res.message, status: res.success ? 'success' : 'error'}));
        else {
            navigator.clipboard.writeText(mnemonics);
            toast({title: 'Copy to clipboard !', status: 'success'});
        }
    };

    return (
        <AuthPage>
            <VStack w="100%">
                <VStack spacing="16px" w="100%">
                    <Textarea
                        value={mnemonics}
                        _focus={{boxShadow: `0px 0px 0px 2px ${colors.red[300]}`}}
                        cursor="text"
                        readOnly
                        id="ipc-signup-text-area"
                    />
                    <VStack w="100%" spacing="64px">
                        <VStack w="100%" spacing="32px">
                            <Button
                                variant={mnemonics ? 'primary' : 'special'}
                                size="lg"
                                w="100%"
                                onClick={onClick}
                                id="ipc-signup-create-copy-mnemonics-button"
                                isLoading={isLoadingCredentials}
                            >
                                {mnemonics ? 'Copy my mnemonics' : 'Create my account'}
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                w="100%"
                                onClick={() => router.push('/drive')}
                                disabled={!mnemonics}
                                id="ipc-signup-go-to-dashboard-button"
                            >
                                Go to my dashboard
                            </Button>
                        </VStack>
                        <VStack w="100%">
                            <Text size="lg" color={textColor}>
                                Already got an account?
                            </Text>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => router.push('/login')}
                                w="100%"
                                id="ipc-signup-login-button"
                            >
                                Login with my account
                            </Button>
                        </VStack>
                    </VStack>
                </VStack>
            </VStack>
        </AuthPage>
    );
};

export default Signup;
