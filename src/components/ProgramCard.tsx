import { Box, Flex } from '@chakra-ui/react';

import type { IPCProgram } from 'types/types';

type ProgramCardProps = {
	program: IPCProgram;
	children: JSX.Element;
};

const ProgramCard = ({ children }: ProgramCardProps): JSX.Element => (
	<Box p="16px" bg="white" w="100%" boxShadow="1px 2px 4px 12px rgb(240, 240, 240)">
		<Flex w="100%" justify="space-between" align="center">
			{children}
		</Flex>
	</Box>
);

export default ProgramCard;
