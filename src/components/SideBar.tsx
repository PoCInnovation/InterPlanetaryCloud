import { Text, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

type SideBarPropsType = {
	contactButton: JSX.Element;
	uploadButton: JSX.Element;
};

const SideBar = ({ contactButton, uploadButton }: SideBarPropsType): JSX.Element => (
	<VStack
		h="100vh"
		minW="300px"
		justify="space-between"
		px="16px"
		py="64px"
		borderRadius="base"
		boxShadow="0px 0px 0px 2px rgba(0, 0, 0, 0.1)"
	>
		<VStack spacing="32px" textAlign="center">
			<Text
				fontSize="20px"
				fontWeight="bold"
				bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
				bgClip="text"
				id="ipc-sideBar-title"
			>
				Inter Planetary Cloud
			</Text>
		</VStack>
		{contactButton}
		{uploadButton}
	</VStack>
);

export default SideBar;
