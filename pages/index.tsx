import Link from 'next/link';
import { Button } from '@chakra-ui/react';

import OutlineButton from 'components/OutlineButton';
import AuthPage from 'components/AuthPage';

const Home = (): JSX.Element => (
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

export default Home;
