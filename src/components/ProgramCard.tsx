import { Box, Flex } from '@chakra-ui/react';

import type { IPCProgram } from 'types/types';

type ProgramCardProps = {
	program: IPCProgram;
	children: JSX.Element;
};

const ProgramCard = ({ children }: ProgramCardProps): JSX.Element => (
	<Box
		p="16px"
		bg="white"
		w="100%"
		boxShadow="0px 2px 5px 15px rgb(240, 240, 240)"
		borderRadius="1px"
		border="0px solid rgb(200, 200, 200)"
		mb="4px"
		display="flex"
		justifyContent="space-between"
	>
		<Flex w="100%" justify="space-between" align="center">
			{children}
		</Flex>
	</Box>
);

export default ProgramCard;
