import { useRouter } from 'next/router';
import { Box, Img, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

import { IoRocketSharp } from 'react-icons/io5';

import Button from 'components/Button';

import colors from 'theme/foundations/colors';

const HeadingSection = (): JSX.Element => {
	const router = useRouter();
	const isMobile: boolean = useBreakpointValue({ base: true, lg: false }) || false;

	return (
		<VStack w="100%" spacing="64px" textAlign="center">
			<VStack spacing="32px" w={{ base: '300px', sm: '550px', md: '600px', lg: '1000px' }}>
				<Text size={isMobile ? '4xl' : '7xl'} id="ipc-landing-headline">
					The first distributed cloud{' '}
					<Box
						as="span"
						backgroundImage={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
						bgClip="text"
					>
						unsealing
					</Box>{' '}
					your data.
				</Text>
				<Text size="xl" maxW="512px" id="ipc-landing-subHeadline">
					Build on top of Aleph, the next generation network of{' '}
					<Box as="span" fontWeight="700">
						distributed
					</Box>{' '}
					big data applications.
				</Text>
			</VStack>
			<Button
				variant="special"
				size={isMobile ? 'xl' : '2xl'}
				buttonType="left-icon"
				icon={IoRocketSharp}
				onClick={() => {
					router.push('/connection');
				}}
				id="ipc-landing-heading-start-button"
			>
				Start the experiment{!isMobile && ' for free'}
			</Button>
			{!isMobile && (
				<>
					<Box as="div" position="absolute" top="75px" left="0px" w="600px" zIndex={-10}>
						<Img
							src="/assets/meshes/blue-ellipse.svg"
							w="600px"
							h="auto"
							ml={{ base: '-500px', xl: '-450px', '2xl': '-400px' }}
							filter="blur(128px)"
						/>
					</Box>
					<Box as="div" w="1280px" h="900px" position="absolute" top="100px" right="0px" overflow="hidden" zIndex={-10}>
						<Img
							src="/assets/meshes/gradient-mesh-3.svg"
							transform="rotate(-38deg)"
							w="1280px"
							h="auto"
							ml={{ base: '900px', xl: '800px', '2xl': '725px' }}
						/>
					</Box>
				</>
			)}
		</VStack>
	);
};

export default HeadingSection;
