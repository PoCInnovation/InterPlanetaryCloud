import { Text, VStack } from '@chakra-ui/react';

import colors from '../theme/foundations/colors';

type AuthPageProps = {
    children: JSX.Element;
}

const AuthPage = ({ children }: AuthPageProps): JSX.Element => (
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
		<VStack w={{ base: '90%', md: '496px' }}>
            {children}
        </VStack>
    </VStack>
)

export default AuthPage;
