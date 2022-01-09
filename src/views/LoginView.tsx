import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Button, FormControl, Link, Text, Textarea, useToast, VStack } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import OutlineButton from 'components/OutlineButton';

import colors from 'theme/foundations/colors';

const LoginView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();

	const [mnemonics, setMnemonics] = useState('');
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

	const toast = useToast();

	const loginWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);
		const login = await auth.loginWithCredentials(mnemonics);
		setIsLoadingCredentials(false);

		if (login.user) {
			toast({
				title: login.message,
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
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
		<VStack spacing={{ base: '48px', md: '56px', lg: '64px' }} w="100%">
			<FormControl>
				<Textarea
					_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
					cursor="text"
					onChange={(e) => setMnemonics(e.target.value)}
					id="ipc-loginView-text-area"
				/>
				<Button
					variant="inline"
					mt="16px"
					w="100%"
					type="submit"
					onClick={() => loginWithCredentials()}
					isLoading={isLoadingCredentials}
					id="ipc-loginView-credentials-button"
				>
					Login with credentials
				</Button>
			</FormControl>
			<VStack w="100%">
				<Text fontSize="14px">Already an account ?</Text>
				<Link as={RouteLink} to="/signup" w="100%">
					<OutlineButton w="100%" text="Signup" id="ipc-loginView-signup-button" />
				</Link>
			</VStack>
		</VStack>
	);
};

export default LoginView;
