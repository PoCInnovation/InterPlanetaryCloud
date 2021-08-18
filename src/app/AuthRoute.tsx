import { Route, RouteProps } from 'react-router-dom';

import { Text, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

interface AuthRouteProps {
	children: JSX.Element;
}

const AuthRoute = ({ children, ...rest }: AuthRouteProps & RouteProps): JSX.Element => (
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

export default AuthRoute;
