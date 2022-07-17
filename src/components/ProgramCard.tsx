import { Box, Flex, Text, VStack } from '@chakra-ui/react';

import type { IPCProgram } from 'types/types';

type ProgramCardProps = {
	program: IPCProgram;
	children: JSX.Element;
};

const ProgramCard = ({ program, children }: ProgramCardProps): JSX.Element => (
	<Box
		p="16px"
		bg="white"
		w="100%"
		boxShadow="0px 2px 5px 15px rgb(240, 240, 240)"
		borderRadius="4px"
		border="1px solid rgb(200, 200, 200)"
		mb="8px"
		display="flex"
		justifyContent="space-between"
	>
		<VStack w="100%" justify="space-between" align="center">
			<Text fontWeight="500" isTruncated maxW="100%">
				{program.name}
			</Text>
			<Flex w="100%" justify="space-between" align="center">
				{children}
			</Flex>
		</VStack>
	</Box>
);

export default ProgramCard;
