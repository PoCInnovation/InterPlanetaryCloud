import { Box, Flex } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';

import type { IPCProgram } from 'types/types';

type ProgramCardProps = {
	program: IPCProgram;
	children: JSX.Element;
};

const ShadowColor = () => {
	const { config } = useConfigContext();
	if (config?.theme === 'gray.800') return '1px 2px 4px 12px rgb(66, 66, 66)';
	return '1px 2px 4px 12px rgb(240, 240, 240)';
};

const ContextColor = () => {
	const { config } = useConfigContext();
	return config?.theme ?? 'white';
};

const ProgramCard = ({ children }: ProgramCardProps): JSX.Element => (
	<Box p="16px" bg={ContextColor()} w="100%" boxShadow={ShadowColor()}>
		<Flex w="100%" justify="space-between" align="center">
			{children}
		</Flex>
	</Box>
);

export default ProgramCard;
