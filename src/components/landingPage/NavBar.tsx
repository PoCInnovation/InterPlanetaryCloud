import { HStack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { IoRocketSharp } from 'react-icons/io5';
import Button from 'components/Button';

const NavBar = (): JSX.Element => {
	const router = useRouter();
	const buttonDisplayable: boolean = useBreakpointValue({ base: false, lg: true }) || false;

	return (
		<>
			{buttonDisplayable ? (
				<HStack justify="space-between" w={{ base: '300px', lg: '750px', '2xl': '1000px' }}>
					<Text size="2xl" variant="gradient" id="ipc-landing-navigation-name">
						Inter Planetary Cloud
					</Text>
					<Button
						variant="special"
						size="xl"
						buttonType="left-icon"
						icon={IoRocketSharp}
						onClick={() => {
							router.push('/connection');
						}}
						id="ipc-landing-navbar-start-button"
					>
						Start the experiment
					</Button>
				</HStack>
			) : (
				<VStack w={{ base: '300px', md: '650px', lg: '750px', '2xl': '1000px' }}>
					<Text size="4xl" variant="gradient" textAlign="center" id="ipc-landing-navigation-name">
						Inter Planetary Cloud
					</Text>
				</VStack>
			)}
		</>
	);
};

export default NavBar;
