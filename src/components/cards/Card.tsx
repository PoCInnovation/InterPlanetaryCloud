import { Flex, HStack, StackProps } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

type FolderCardProps = {
	children: JSX.Element;
};

const FolderCard = ({ children, ...props }: FolderCardProps & StackProps): JSX.Element => (
	<HStack
		w="100%"
		borderRadius="8px"
		border={`1px solid ${colors.blue['300']}`}
		p="16px 20px"
		justify="space-between"
		{...props}
	>
		<Flex w="100%" justify="space-between" align="center">
			{children}
		</Flex>
	</HStack>
);

export default FolderCard;
