import { Route, RouteProps, useHistory } from 'react-router-dom';

import { Text, VStack } from '@chakra-ui/react';
import { useUserContext } from 'contexts/user';

interface PrivateRouteProps {
	children: JSX.Element;
}

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps & RouteProps): JSX.Element => {
	const { user } = useUserContext();
	const history = useHistory();

	if (!user) history.push('/');

	return (
		<Route {...rest}>
			<VStack>
				<Text>This is a private Route</Text>
				{children}
			</VStack>
		</Route>
	);
};

export default PrivateRoute;
