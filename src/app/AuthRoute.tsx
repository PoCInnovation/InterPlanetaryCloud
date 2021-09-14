import { useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { Text, VStack } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

import colors from 'theme/foundations/colors';

type AuthRouteProps = { children: JSX.Element } & RouteProps;

const AuthRoute = ({ children, ...rest }: AuthRouteProps): JSX.Element => {
	const { user } = useUserContext();
	const history = useHistory();

	useEffect(() => {
		if (user) history.push('/dashboard');
	}, [user]);

	return (
		<Route {...rest}>
			<VStack spacing="56px" mt="132px">
				<VStack spacing="16px">
					<Text
						fontSize="64px"
						fontWeight="extrabold"
						bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
						bgClip="text"
					>
						Inter Planetary Cloud
					</Text>
					<Text fontSize="16px">The first cloud unsealing your data</Text>
				</VStack>
				<VStack w="496px">{children}</VStack>
			</VStack>
		</Route>
	);
};

export default AuthRoute;
