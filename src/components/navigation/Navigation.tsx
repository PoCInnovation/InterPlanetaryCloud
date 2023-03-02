import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { VStack } from '@chakra-ui/react';


import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';
import { ResponsiveBar } from './ResponsiveBar';

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
