import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Button, FormControl, FormLabel, Input, Link, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { AuthReturnType } from 'lib/auth';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import OutlineButton from 'components/OutlineButton';
import MnemonicsModal from 'components/MnemonicsModal';

import colors from 'theme/foundations/colors';

const SignupView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();

	const [username, setUsername] = useState('');
	const [mnemonics, setMnemonics] = useState('Click to signup button to see your mnemonics');
	const [signupResult, setSignupResult] = useState<AuthReturnType | undefined>(undefined);
	const [isLoadingMetamask, setIsLoadingMetamask] = useState(false);
	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const signupWithMetamask = async (): Promise<void> => {
		setIsLoadingMetamask(true);
		const login = await auth.loginWithMetamask();
		setIsLoadingMetamask(false);

		if (login.user) {
			toast({
				title: login.message,
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			localStorage.setItem('user', JSON.stringify(login.user));
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

	const signupWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);
		const signup = await auth.signup(username);
		setIsLoadingCredentials(false);

		if (signup.user) {
			const returnedMnemonics = signup.user.account?.mnemonics
				? signup.user.account.mnemonics.phrase
				: 'No mnemonics provided.';
			setMnemonics(returnedMnemonics);
			setSignupResult(signup);
			onOpen();
		} else {
			toast({
				title: signup.message,
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const closeModal = () => {
		onClose();
		if (!signupResult) return;
		toast({
			title: signupResult.message,
			status: 'success',
			duration: 2000,
			isClosable: true,
		});
		localStorage.setItem('user', JSON.stringify(signupResult.user));
		setUser(signupResult.user);
	};

	return (
		<VStack spacing="80px" w="496px">
			<VStack spacing="16px" w="100%">
				<Button variant="inline" onClick={() => signupWithMetamask()} w="100%" isLoading={isLoadingMetamask}>
					Signup with metamask
				</Button>
				<Link href="https://metamask.io" isExternal>
					<u>What is metamask ?</u>
				</Link>
			</VStack>
			<FormControl>
				<FormLabel>Username</FormLabel>
				<Input
					_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<Button
					variant="inline"
					mt="16px"
					w="100%"
					type="submit"
					onClick={() => signupWithCredentials()}
					isLoading={isLoadingCredentials}
				>
					Signup with credentials
				</Button>
			</FormControl>
			<Link as={RouteLink} to="/login" w="100%">
				<OutlineButton w="100%" text="Login" />
			</Link>
			<MnemonicsModal mnemonics={mnemonics} isOpen={isOpen} onClose={closeModal} />
		</VStack>
	);
};

export default SignupView;
