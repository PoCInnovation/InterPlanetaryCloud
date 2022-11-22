import { Button } from '@chakra-ui/react';
import Link from 'next/link';

import AuthPage from 'components/AuthPage';
import OutlineButton from 'components/OutlineButton';

const Connection = (): JSX.Element => (
	<AuthPage
		children={
			<>
				<Link href="/signup">
					<Button variant="inline" w="100%" id="ipc-home-create-account-button">
						Create an account
					</Button>
				</Link>
				<Link href="/login">
					<div style={{ width: '100%' }}>
						<OutlineButton w="100%" id="ipc-home-login-button" text="Login" />
					</div>
				</Link>
			</>
		}
	/>
);

export default Connection;
