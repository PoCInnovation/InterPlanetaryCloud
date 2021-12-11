import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Button, FormControl, Link, Textarea, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { AuthReturnType } from 'lib/auth';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import Modal from 'components/Modal';
import OutlineButton from 'components/OutlineButton';

import colors from 'theme/foundations/colors';

const SignupView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();

	const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
	const [signupResult, setSignupResult] = useState<AuthReturnType | undefined>(undefined);
	const [mnemonics, setMnemonics] = useState('Click to signup button to see your mnemonics');

	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();

	const signupWithCredentials = async (): Promise<void> => {
		setIsLoadingCredentials(true);

		const signup = await auth.signup();

		setIsLoadingCredentials(false);

		if (signup.user && signup.user.account) {
			const returnedMnemonics = signup.mnemonic ? signup.mnemonic : 'No mnemonics provided.';
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
		setUser(signupResult.user);
	};

	const onClick = () => {
		navigator.clipboard.writeText(mnemonics);
		toast({
			title: 'Copy to clipboard !',
			status: 'success',
			duration: 2000,
			isClosable: true,
		});
	};

	return (
		<VStack spacing="80px" w="496px">
			<FormControl>
				<Button
					variant="inline"
					mt="16px"
					w="100%"
					type="submit"
					onClick={() => signupWithCredentials()}
					isLoading={isLoadingCredentials}
					id="ipc-signupView-credentials-signup-button"
				>
					Signup with credentials
				</Button>
			</FormControl>
			<Link as={RouteLink} to="/login" w="100%">
				<OutlineButton w="100%" text="Login" id="ipc-signupView-login-button" />
			</Link>
			<Modal
				isOpen={isOpen}
				onClose={closeModal}
				title="Your Mnemonics"
				CTA={
					<Button variant="inline" onClick={onClick} w="100%" mb="16px" id="ipc-signupView-copy-mnemonics-button">
						Copy my mnemonics
					</Button>
				}
			>
				<Textarea
					value={mnemonics}
					_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
					cursor="text"
					readOnly
					id="ipc-signupView-text-area"
				/>
			</Modal>
		</VStack>
	);
};

export default SignupView;
