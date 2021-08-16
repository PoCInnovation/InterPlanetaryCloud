import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import {
	Button,
	Center,
	FormControl,
	FormLabel,
	Input,
	Link,
	Text,
	Textarea,
	useToast,
	VStack,
} from '@chakra-ui/react';

import colors from 'theme/foundations/colors';
import { useAuthContext } from '../../contexts/auth';
import { useUserContext } from '../../contexts/user';

const SignupView = (): JSX.Element => {
	const auth = useAuthContext();
	const { setUser } = useUserContext();
	const [username, setUsername] = React.useState('');
	const [mnemonics, setMnemonics] = React.useState('Click register to see your mnemonics');
	const toast = useToast();

	const signupWithCredentials = async (): Promise<void> => {
		const signup = await auth.signup(username);

		if (signup.user) {
			const returnedMnemonics = signup.user.account?.mnemonics
				? signup.user.account.mnemonics.phrase
				: 'No mnemonics provided.';
			setMnemonics(returnedMnemonics);
			setUser(signup.user);
			toast({
				title: 'Welcome !',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} else {
			toast({
				title: 'Please try again',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<Center>
			<VStack spacing="80px" mt="220px" w="496px">
				<VStack spacing="16px" w="100%">
					<Text fontWeight="600">Already have metamask ?</Text>
					<Link as={RouteLink} to="/login" w="100%">
						<Button color="yellow.100" bg="yellow.500" w="100%">
							Login
						</Button>
					</Link>
				</VStack>
				<FormControl>
					<FormLabel>Username</FormLabel>
					<Input
						_focus={{ boxShadow: `0px 0px 0px 2px ${colors.green[300]}` }}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<FormLabel mt="8px">Mnemonics</FormLabel>
					<Textarea
						_focus={{ boxShadow: `0px 0px 0px 2px ${colors.green[300]}` }}
						cursor="text"
						value={mnemonics}
						readOnly
					/>
					<Button
						color="green.700"
						bg="green.300"
						mt="16px"
						w="100%"
						type="submit"
						onClick={() => signupWithCredentials()}
					>
						Signup with credentials
					</Button>
				</FormControl>
			</VStack>
		</Center>
	);
};

export default SignupView;
