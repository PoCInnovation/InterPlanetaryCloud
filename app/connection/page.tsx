'use client';

import { Link, Stack, useBreakpointValue } from '@chakra-ui/react';
import { BsRocketTakeoffFill } from 'react-icons/bs';

import AuthPage from 'components/AuthPage';
import Button from 'components/Button';

const Connection = (): JSX.Element => {
	const isMobile = useBreakpointValue({ base: true, md: false }) || false;

	return (
		<AuthPage>
			<Stack direction={{ base: 'column', md: 'row' }} w="100%" spacing="32px">
				<Link href="/signup" w="100%">
					<Button variant="primary" size={isMobile ? 'lg' : 'xl'} w="100%" id="ipc-home-create-account-button">
						Create an account
					</Button>
				</Link>
				<Link href="/login" w="100%">
					<Button
						variant="secondary"
						size={isMobile ? 'lg' : 'xl'}
						w="100%"
						id="ipc-home-login-button"
						buttonType="left-icon"
						icon={BsRocketTakeoffFill}
					>
						Login
					</Button>
				</Link>
			</Stack>
		</AuthPage>
	);
};

export default Connection;
