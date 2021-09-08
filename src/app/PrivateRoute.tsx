import { useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { Center, Spinner, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

type PrivateRouteProps = { children: JSX.Element } & RouteProps;

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps): JSX.Element => {
	const { user, setUser } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		(() => {
			const userString = localStorage.getItem('user');

			if (!userString) history.push('/');

			setUser(JSON.parse(userString!));
		})();
	}, []);

	if (!user)
		return (
			<Center mt="160px">
				<Spinner w="160px" />
			</Center>
		);

	return (
		<Route {...rest}>
			<VStack>{children}</VStack>
		</Route>
	);
};

export default PrivateRoute;
