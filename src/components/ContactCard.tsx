import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { IPCContact } from '../types/types';

type FileCardProps = {
	contact: IPCContact;
	children: JSX.Element;
};

export const ContactCard = ({ contact, children }: FileCardProps): JSX.Element => (
	<Box
		p="16px"
		bg="white"
		w="100%"
		boxShadow="0px 2px 3px 3px rgb(240, 240, 240)"
		borderRadius="4px"
		border="1px solid rgb(200, 200, 200)"
		mb="8px"
		display="flex"
		justifyContent="space-between"
	>
		<VStack w="100%" justify="space-between" align="center">
			<Text fontWeight="500">{contact.name}</Text>
			<Flex w="100%" justify="space-between" align="center">
				{children}
			</Flex>
		</VStack>
	</Box>
);
