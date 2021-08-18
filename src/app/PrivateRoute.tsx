import { Route, RouteProps } from 'react-router-dom';

import { Text, VStack } from '@chakra-ui/react';

interface AuthRouteProps {
	children: JSX.Element;
}

// TODO: Update this component to check if the user is logged
const AuthRoute = ({ children, ...rest }: AuthRouteProps & RouteProps): JSX.Element => (
	<Route {...rest}>
		<VStack>
			<Text>This is a private Route</Text>
			{children}
		</VStack>
	</Route>
);

export default AuthRoute;
