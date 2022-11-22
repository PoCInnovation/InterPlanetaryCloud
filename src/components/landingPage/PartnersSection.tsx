import { Box, Img, Stack, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

const PartnersSection = (): JSX.Element => (
	<VStack spacing={{ base: '64px', md: '72px' }}>
		<Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '64px', md: '128px' }}>
			<Img src="/assets/logos/poc-logo.svg" w="auto" h={{ base: '42px', md: '50px' }} color="#000F60" />
			<Img src="/assets/logos/aleph-logo.svg" w="auto" h={{ base: '42px', md: '50px' }} color="#000F60" />
		</Stack>
		<Box
			w={{ base: '250px', sm: '350px', xl: '1000px' }}
			h="5px"
			bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
			borderRadius="16px"
		/>
	</VStack>
);

export default PartnersSection;
