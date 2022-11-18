import { Box, HStack, Img, Stack, Text, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

const Footer = (): JSX.Element => (
	<VStack bg="blue.50" w="100%" py="64px" spacing="64px" boxShadow={`0px 0px 128px ${colors.blue[100]}`}>
		<Box
			w="750px"
			h="5px"
			bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
			borderRadius="16px"
		/>
		<Text size="3xl">
			Everything is{' '}
			<Box
				as="span"
				bgGradient={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
				bgClip="text"
			>
				open source
			</Box>
			.
		</Text>
		<VStack spacing="24px">
			<HStack>
				<Text size="boldXl">Contribute with us on </Text>
				<Img src="/assets/logos/github-logo.svg" w="20px" h="auto" />
				<Text size="boldXl" variant="gradient">
					@PoCInnovation
				</Text>
			</HStack>
			<HStack>
				<Stack spacing="4px">
					<HStack>
						<Text size="boldLg">Join us</Text>
						<Img src="/assets/logos/discord-logo.svg" w="20px" h="auto" />
						<Text size="boldLg" variant="gradient">
							@PoC - Community
						</Text>
					</HStack>
					<HStack pl="66px">
						<Img src="/assets/logos/linkedin-logo.svg" w="20px" h="auto" />
						<Text size="boldLg" variant="gradient">
							@pocinnovation
						</Text>
					</HStack>
				</Stack>
			</HStack>
		</VStack>
		<HStack spacing="12px">
			<Text size="3xl">Made by the</Text>
			<Img src="/assets/logos/poc-logo.svg" h="24px" w="auto" />
			<Text size="3xl">team.</Text>
		</HStack>
	</VStack>
);

export default Footer;
