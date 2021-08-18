import { Route, RouteProps } from 'react-router-dom';

import { Box, Text, VStack } from '@chakra-ui/react';

interface AuthRouteProps {
	children: JSX.Element;
}

const AuthRoute = ({ children, ...rest }: AuthRouteProps & RouteProps): JSX.Element => (
	<Route {...rest}>
		<VStack spacing="80px" mt="132px">
			<VStack>
				<Text color="blue.500" fontSize="64px" fontWeight="extrabold">
					<Box opacity="0.95" padding="0px 5px">
						Inter Planetary Cloud
					</Box>
				</Text>
				<Text fontSize="24px" color="blue.500">
					The first cloud unsealing your data
				</Text>
			</VStack>
			<VStack mt="3000px" w="496px">
				{children}
			</VStack>
		</VStack>
	</Route>
);

export default AuthRoute;
