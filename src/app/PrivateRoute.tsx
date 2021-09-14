import { useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { Center, Spinner } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

type PrivateRouteProps = { children: JSX.Element } & RouteProps;

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps): JSX.Element => {
	const { user } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		if (!user) history.push('/');
	}, []);

	if (!user)
		return (
			<Center mt="160px">
				<Spinner w="160px" />
			</Center>
		);

	return <Route {...rest}>{children}</Route>;
};

export default PrivateRoute;
