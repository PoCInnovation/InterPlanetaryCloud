import { useBreakpointValue, VStack } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';

import { ResponsiveBar } from './ResponsiveBar';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const { config } = useConfigContext();

	return (
		<VStack
			align="start"
			bg={config?.theme ?? 'white'}
			m={{ base: '96px 64px 32px 64px', lg: '96px 64px 32px 364px' }}
		>
			<ResponsiveBar />
			{children}
		</VStack>
	);
};

export default Navigation;
