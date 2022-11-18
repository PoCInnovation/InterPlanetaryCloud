import { Box, HStack, Img, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

const Footer = (): JSX.Element => {
	const isMobile: boolean = useBreakpointValue({ base: true, sm: false }) || false;

	return (
		<VStack
			bg="blue.50"
			w="100%"
			py="64px"
			spacing={{ base: '48px', sm: '64px' }}
			boxShadow={`0px 0px 128px ${colors.blue[100]}`}
		>
			<Box
				w={{ base: '250px', sm: '400px', lg: '600px', xl: '750px' }}
				h="5px"
				bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
				borderRadius="16px"
			/>
			<Text size={isMobile ? 'boldXl' : '3xl'} textAlign="center">
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
			{isMobile ? (
				<>
					<VStack spacing="24px">
						<VStack spacing="4px">
							<Text size="boldLg">Contribute with us on </Text>
							<HStack>
								<Img src="/assets/logos/github-logo.svg" w="20px" h="auto" />
								<Text size="boldLg" variant="gradient">
									@PoCInnovation
								</Text>
							</HStack>
						</VStack>
						<VStack spacing="4px">
							<Text size="boldLg">Join us</Text>
							<HStack>
								<Img src="/assets/logos/discord-logo.svg" w="20px" h="auto" />
								<Text size="boldLg" variant="gradient">
									@PoC - Community
								</Text>
							</HStack>
							<HStack>
								<Img src="/assets/logos/linkedin-logo.svg" w="20px" h="auto" />
								<Text size="boldLg" variant="gradient">
									@pocinnovation
								</Text>
							</HStack>
						</VStack>
					</VStack>
					<VStack spacing="4px">
						<Text size="boldXl">Made by the</Text>
						<HStack>
							<Img src="/assets/logos/poc-logo.svg" h="16px" w="auto" />
							<Text size="boldXl">team.</Text>
						</HStack>
					</VStack>
				</>
			) : (
				<>
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
				</>
			)}
		</VStack>
	);
};

export default Footer;
