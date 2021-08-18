import { Link as RouteLink } from 'react-router-dom';

import { Button, Link } from '@chakra-ui/react';

const HomeView = (): JSX.Element => (
	<>
		<Link as={RouteLink} to="/signup" w="100%">
			<Button color="blue.100" bg="blue.900" size="md" w="100%">
				Create an account
			</Button>
		</Link>
		<Link as={RouteLink} to="/login" w="100%">
			<Button color="blue.900" bg="blue.100" size="sm" w="100%">
				Login
			</Button>
		</Link>
	</>
);

export default HomeView;
