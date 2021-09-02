import { Route, RouteProps } from 'react-router-dom';

import { VStack } from '@chakra-ui/react';

interface PrivateRouteProps {
	children: JSX.Element;
}

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps & RouteProps): JSX.Element => (
	<Route {...rest}>
		<VStack>{children}</VStack>
	</Route>
);

export default PrivateRoute;
