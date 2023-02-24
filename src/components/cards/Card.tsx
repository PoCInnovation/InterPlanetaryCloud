import { Flex, HStack, StackProps } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

type FolderCardProps = {
	children: JSX.Element;
	size?: 'sm' | 'md';
};

const Card = ({ children, size = 'sm', ...props }: FolderCardProps & StackProps): JSX.Element => (
	<HStack
		w="100%"
		borderRadius="8px"
		border={`${size === 'sm' ? '1px' : '2px'} solid ${colors.blue['300']}`}
		p="16px 20px"
		justify="space-between"
		{...props}
	>
		<Flex w="100%" justify="space-between" align="center">
			{children}
		</Flex>
	</HStack>
);

export default Card;
