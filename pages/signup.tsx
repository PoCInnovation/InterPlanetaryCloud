import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, Text, Textarea, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

import { AuthReturnType } from 'lib/auth';

import Modal from 'components/Modal';
import OutlineButton from 'components/OutlineButton';
import AuthPage from 'components/AuthPage';

import colors from 'theme/foundations/colors';

const Signup = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const router = useRouter();

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
		router.push('/dashboard');
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
		<AuthPage
			children={
				<VStack spacing={{ base: '48px', md: '56px', lg: '64px' }} w="100%">
					<Button
						variant="inline"
						mt="16px"
						w="100%"
						type="submit"
						onClick={() => signupWithCredentials()}
						isLoading={isLoadingCredentials}
						id="ipc-signup-credentials-signup-button"
					>
						Signup
					</Button>
					<VStack w="100%">
						<Text fontSize="14px">Already an account ?</Text>
						<Link href="/login">
							<div style={{ width: '100%' }}>
								<OutlineButton w="100%" text="Login" id="ipc-signup-login-button" />
							</div>
						</Link>
					</VStack>
					<Modal
						isOpen={isOpen}
						onClose={closeModal}
						title="Your Mnemonics"
						CTA={
							<Button variant="inline" onClick={onClick} w="100%" mb="16px" id="ipc-signup-copy-mnemonics-button">
								Copy my mnemonics
							</Button>
						}
					>
						<Textarea
							value={mnemonics}
							_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
							cursor="text"
							readOnly
							id="ipc-signup-text-area"
						/>
					</Modal>
				</VStack>
			}
		/>
	);
};

export default Signup;
