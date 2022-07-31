import { Box, Flex, HStack } from '@chakra-ui/react';

type FolderCardProps = {
	children: JSX.Element;
};

const FolderCard = ({ children }: FolderCardProps): JSX.Element => (
	<Box
		p="16px"
		bg="white"
		w="100%"
		boxShadow="0px 2px 3px 3px rgb(240, 240, 240)"
		borderRadius="4px"
		border="0px solid rgb(200, 200, 200)"
		mb="8px"
		display="flex"
		justifyContent="space-between"
	>
		<HStack w="100%">
			<Flex w="100%" justify="space-between" align="center">
				{children}
			</Flex>
		</HStack>
	</Box>
);

export default FolderCard;
