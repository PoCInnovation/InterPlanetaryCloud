import { Link, Text, useBreakpointValue, useColorModeValue, VStack } from '@chakra-ui/react';
import { textColorMode } from 'config/colorMode';

type AuthPageProps = {
	children: JSX.Element;
};

const AuthPage = ({ children }: AuthPageProps): JSX.Element => {
	const isMobile: boolean = useBreakpointValue({ base: true, md: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	return (
		<VStack spacing="56px" p={{ base: '96px 32px', md: '128px 64px' }}>
			<VStack spacing="16px" w="100%">
				<Link href="/">
					<Text variant="gradient" size={isMobile ? '3xl' : '7xl'} id="ipc-title" textAlign="center" cursor="pointer">
						Inter Planetary Cloud
					</Text>
				</Link>
				<Text size={isMobile ? 'lg' : 'xl'} id="ipc-sub-title" textAlign="center" color={textColor}>
					The first cloud unsealing your data
				</Text>
			</VStack>
			<VStack w={{ base: '100%', sm: '512px' }}>{children}</VStack>
		</VStack>
	);
};

export default AuthPage;
