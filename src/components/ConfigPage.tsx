import React, { useState } from 'react';
import { Text, Input, Button, useToast } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

const ConfigPage = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const [ColorTheme, setColorTheme] = useState('');

	const configUser = async () => {
		try {
			const config1 = await user.contact.configFile(ColorTheme);
			setConfig({ theme: ColorTheme });
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: 'Fail change theme', status: 'error' });
			console.error(error);
		}
	};

	return (
		<>
			<Text>InterPlanetaryCloud Configuration</Text>
			<Input onChange={(e) => setColorTheme(e.target.value)}></Input>
			<Button onClick={configUser}></Button>
		</>
	);
};

export default ConfigPage;
