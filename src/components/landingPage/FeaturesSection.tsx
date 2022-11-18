import { useRouter } from 'next/router';
import { Box, HStack, Img, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

import { IoRocketSharp } from 'react-icons/io5';

import Button from 'components/Button';

import colors from 'theme/foundations/colors';

const FeatureCard = ({ title, icon }: { title: string; icon: string }): JSX.Element => {
	const isMobile: boolean = useBreakpointValue({ base: true, sm: false }) || false;

	return (
		<HStack bg="blue.100" borderRadius="12px" p="8px 16px">
			<Img src={icon} w={isMobile ? '24px' : '30px'} h="auto" />
			<Text size={isMobile ? 'boldXl' : '2xl'}>{title}</Text>
		</HStack>
	);
};

const FeaturesSection = (): JSX.Element => {
	const router = useRouter();
	const isMobile: boolean = useBreakpointValue({ base: true, lg: false }) || false;

	const features: { icon: string; title: string }[] = [
		{
			icon: '/assets/icons/upload-files-logo.svg',
			title: 'Upload & Download Files',
		},
		{
			icon: '/assets/icons/folder-logo.svg',
			title: 'Folder Management',
		},
		{
			icon: '/assets/icons/share-logo.svg',
			title: 'Share Files',
		},
		{
			icon: '/assets/icons/code-logo.svg',
			title: 'Upload & Run programs',
		},
		{
			icon: '/assets/icons/contact-logo.svg',
			title: 'Contact Management',
		},
	];

	return (
		<VStack spacing={{ base: '128px', lg: '256px' }} w="100%" position="relative">
			<Stack spacing="32px" mr={{ base: '0px', lg: '400px' }} px="32px">
				<Text size={isMobile ? '3xl' : '4xl'}>
					Our{' '}
					<Box
						as="span"
						bgGradient={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
						bgClip="text"
					>
						Features
					</Box>
				</Text>
				{features.map((feature) => (
					<FeatureCard key={feature.title} title={feature.title} icon={feature.icon} />
				))}
			</Stack>
			<VStack spacing={{ base: '24px', md: '42px' }}>
				<Box
					w={{ base: '250px', sm: '400px', lg: '600px', xl: '750px', '3xl': '1000px' }}
					h="5px"
					bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
					borderRadius="16px"
				/>
				<Text size={isMobile ? '2xl' : '4xl'}>Are you ready?</Text>
				<Button
					variant="special"
					size={isMobile ? 'xl' : '2xl'}
					buttonType="left-icon"
					icon={IoRocketSharp}
					onClick={() => {
						router.push('/connection');
					}}
				>
					Start the experiment
				</Button>
			</VStack>
			{!isMobile && (
				<Box as="div" w="1000px" h="1200px" position="absolute" top="-350px" right="0px" overflow="hidden" zIndex={-10}>
					<Img
						src="/assets/meshes/gradient-mesh-2.svg"
						w="1000px"
						h="auto"
						transform="rotate(55deg)"
						ml={{ base: '500px', '2xl': '450px' }}
					/>
				</Box>
			)}
		</VStack>
	);
};

export default FeaturesSection;
