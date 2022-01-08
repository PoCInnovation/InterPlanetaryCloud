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
			<VStack spacing="56px" mt={{ base: '96px', '2xs': '112px', sm: '132px' }}>
				<VStack spacing="16px">
					<Text
						fontSize={{
							base: '12px',
							'3xs': '16px',
							'2xs': '20px',
							xs: '26px',
							'3sm': '34px',
							'2sm': '40px',
							sm: '50px',
							'2md': '56px',
							md: '64px',
						}}
						fontWeight="extrabold"
						bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
						bgClip="text"
						id="ipc-title"
						textAlign="center"
					>
						Inter Planetary Cloud
					</Text>
					<Text
						fontSize={{ base: '6px', '3xs': '10px', '2xs': '12px', xs: '14px', '2sm': '16px' }}
						id="ipc-sub-title"
						textAlign="center"
					>
						The first cloud unsealing your data
					</Text>
				</VStack>
				<VStack
					w={{ base: '96px', '3xs': '163px', '2xs': '217px', xs: '272px', '3sm': '346px', '2sm': '408px', sm: '496px' }}
				>
					{children}
				</VStack>
			</VStack>
		</Route>
	);
};

export default AuthRoute;
