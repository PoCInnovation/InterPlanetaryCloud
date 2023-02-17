import { useBreakpointValue, VStack } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ResponsiveBar } from './ResponsiveBar';
import { useUserContext } from '../../contexts/user';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const { config } = useConfigContext();
	const { user } = useUserContext();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/');
		}
	}, []);

	return (
		<VStack
			align="start"
			bg={config?.theme ?? 'white'}
			m={{ base: '128px 64px 32px 64px', lg: '128px 64px 32px 364px' }}
		>
			<ResponsiveBar />
			{children}
		</VStack>
	);
};

export default Navigation;
