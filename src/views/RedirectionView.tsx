import { Button, Link, VStack, Text } from '@chakra-ui/react';

import { Link as RouteLink } from 'react-router-dom';

import OutlineButton from 'components/OutlineButton';

import colors from 'theme/foundations/colors';

const RedirectionView = (): JSX.Element => (
	<VStack spacing="56px" mt={{ base: '96px', md: '132px' }}>
		<VStack spacing="16px">
			<Text
				fontSize={{ base: '32px', md: '56px', lg: '64px' }}
				fontWeight="extrabold"
				bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
				bgClip="text"
				id="ipc-title"
				textAlign="center"
			>
				Inter Planetary Cloud / Computing
			</Text>
			<Text
				fontSize={{ base: '6px', '3xs': '10px', '2xs': '12px', xs: '14px', '2sm': '16px' }}
				id="ipc-sub-title"
				textAlign="center"
			>
				Select your service
			</Text>
		</VStack>
		<VStack w={{ base: '90%', md: '496px' }}>
			<Link as={RouteLink} to="/dashboard" w="100%">
				<Button variant="inline" w="100%" id="ipc-homeView-create-account-button">
					InterPlanetaryCloud
				</Button>
			</Link>
			<Link as={RouteLink} to="/computing" w="100%" id="ipc-homeView-login-button">
				<OutlineButton w="100%" text="InterPlanetaryComputing" />
			</Link>
		</VStack>
	</VStack>
);

export default RedirectionView;
