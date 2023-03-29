import { Flex, HStack, StackProps, useColorMode } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

type FolderCardProps = {
	children: JSX.Element;
	size?: 'sm' | 'md';
};

const Card = ({ children, size = 'sm', ...props }: FolderCardProps & StackProps): JSX.Element => {
	const { colorMode } = useColorMode();

	return (
		<HStack
			w="100%"
			borderRadius="8px"
			border={`${size === 'sm' ? '1px' : '2px'} solid ${
				colorMode === 'light' ? colors.blue['300'] : colors.blue['700']
			}`}
			p="16px 20px"
			justify="space-between"
			{...props}
		>
			<Flex w="100%" justify="space-between" align="center">
				{children}
			</Flex>
		</HStack>
	);
};

export default Card;
