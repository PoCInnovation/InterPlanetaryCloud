import { Link as RouteLink } from 'react-router-dom';

import { Button, Link } from '@chakra-ui/react';

import OutlineButton from 'components/OutlineButton';

const HomeView = (): JSX.Element => (
	<>
		<Link as={RouteLink} to="/signup" w="100%">
			<Button variant="inline" w="100%">
				Create an account
			</Button>
		</Link>
		<Link as={RouteLink} to="/login" w="100%">
			<OutlineButton w="100%" text="Login" />
		</Link>
	</>
);

export default HomeView;
