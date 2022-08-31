import React, { useState } from 'react';
import { Text, Input, Button, useToast, Box, HStack, useColorMode, useColorModeValue } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

import { BsCode, BsCodeSlash } from 'react-icons/bs';

const ConfigPage = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const [ColorTheme, setColorTheme] = useState('');
	const { toggleColorMode } = useColorMode();
	const color = useColorModeValue('white', 'gray.800');
	const colorText = useColorModeValue('gray.800', 'white');

	const Theme = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.toLowerCase() === 'dark') setColorTheme('gray.800');
		else if (e.target.value.toLowerCase() === 'light') setColorTheme('white');
		else setColorTheme('undefined');
	};

	const configUser = async () => {
		try {
			if (ColorTheme === 'undefined') {
				toast({ title: "This color doesn't exist", status: 'error' });
				return;
			}
			const config1 = await user.contact.configFile(ColorTheme);
			setConfig({ theme: ColorTheme });
			toggleColorMode();
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: 'Fail change theme', status: 'error' });
			console.error(error);
		}
	};

	return (
		<>
			<Text fontSize="3xl">InterPlanetaryCloud Configuration</Text>
			<Box borderWidth="2px" w="90%" h="750px">
				<BsCode size="25" color={colorText}></BsCode>
				<HStack>
					<Text marginLeft="30" textColor={colorText}>
						Theme (Dark or Light)
					</Text>
					<Input onChange={Theme} w="60%"></Input>
				</HStack>
				<BsCodeSlash size="25" color={colorText}></BsCodeSlash>
			</Box>
			<Button onClick={configUser} w="90%" backgroundColor={color} textColor={colorText} justifyContent="center">
				Save
			</Button>
		</>
	);
};

export default ConfigPage;
