import { Box, Icon, Stack, useColorModeValue, VStack } from '@chakra-ui/react';

import { textColorMode } from 'config/colorMode';

import { AlephLogo, PoCLogo } from 'assets/icons/logos';

import colors from 'theme/foundations/colors';

const PartnersSection = (): JSX.Element => {
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	return (
		<VStack spacing={{ base: '64px', md: '72px' }}>
			<Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '64px', md: '128px' }}>
				<Icon as={PoCLogo} w="auto" h={{ base: '42px', md: '50px' }} color={textColor} />
				<Icon as={AlephLogo} w="auto" h={{ base: '42px', md: '50px' }} color={textColor} />
			</Stack>
			<Box
				w={{ base: '250px', sm: '350px', xl: '1000px' }}
				h="5px"
				bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
				borderRadius="16px"
			/>
		</VStack>
	);
};

export default PartnersSection;
