import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react';
import colors from 'theme/foundations/colors';

type OutlineButtonProps = { text: string } & ButtonProps;

const OutlineButton = ({ text, ...rest }: OutlineButtonProps): JSX.Element => (
	<Button variant="inline" {...rest} p="4px" _hover={{ opacity: 0.8 }}>
		<Flex w="100%" bg="white" h="100%" borderRadius="base" justify="center" align="center">
			<Text bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`} bgClip="text">
				{text}
			</Text>
		</Flex>
	</Button>
);

export default OutlineButton;
