import { Box, HStack, Img, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

const PartnersSection = (): JSX.Element => (
	<VStack spacing="72px">
		<HStack spacing="128px">
			<Img src="/assets/logos/poc-logo.svg" w="auto" h="50px" color="#000F60" />
			<Img src="/assets/logos/aleph-logo.svg" w="auto" h="50px" color="#000F60" />
		</HStack>
		<Box
			w={{ base: '750px', xl: '1000px' }}
			h="5px"
			bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
			borderRadius="16px"
		/>
	</VStack>
);

export default PartnersSection;
