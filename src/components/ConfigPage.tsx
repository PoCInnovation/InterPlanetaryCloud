// import {
// 	Box,
// 	Button,
// 	Stack,
// 	VStack,
// 	Image,
// 	Input,
// 	Text,
// 	useColorMode,
// 	useColorModeValue,
// 	useToast,
// 	HStack,
// } from '@chakra-ui/react';
// import { ChangeEvent, useState } from 'react';
// import { BsCode, BsCodeSlash } from 'react-icons/bs';

// import { useConfigContext } from 'contexts/config';
// import { useUserContext } from 'contexts/user';
// import colors from 'theme/foundations/colors';

// const ConfigPage = (): JSX.Element => {
// 	const { user } = useUserContext();
// 	const { setConfig } = useConfigContext();
// 	const toast = useToast({ duration: 2000, isClosable: true });
// 	const [ColorTheme, setColorTheme] = useState('');
// 	const { toggleColorMode } = useColorMode();
// 	const color = useColorModeValue('white', 'gray.800');
// 	const colorText = useColorModeValue('gray.800', 'white');
// 	const [isLoading, setIsLoading] = useState(false);

// 	const Theme = (e: ChangeEvent<HTMLInputElement>) => {
// 		if (e.target.value.toLowerCase() === 'dark') setColorTheme('gray.800');
// 		else if (e.target.value.toLowerCase() === 'light') setColorTheme('white');
// 		else setColorTheme('undefined');
// 	};

// 	const configUser = async () => {
// 		setIsLoading(true);
// 		try {
// 			if (ColorTheme === 'undefined') {
// 				toast({ title: "This color doesn't exist", status: 'error' });
// 				return;
// 			}
// 			const config1 = await user.contact.configFile(ColorTheme);
// 			setConfig({ ...user.config!, theme: ColorTheme });
// 			toggleColorMode();
// 			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
// 		} catch (error) {
// 			toast({ title: 'Fail change theme', status: 'error' });
// 			console.error(error);
// 		}
// 		setIsLoading(false);
// 	};

// 	return (
// 		<>
// 			<Stack spacing="16px">
// 				<Stack bg="blue.50" p="8px 50px" w="100%" borderRadius="8px">
// 					<Text>
// 						<Box
// 							as="span"
// 							bgClip="text"
// 							bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
// 							fontWeight="700"
// 						>
// 							Settings
// 						</Box>
// 					</Text>
// 				</Stack>
// 			</Stack>

// 			<HStack gridGap={5}>
// 				<VStack
// 					w="600px"
// 					h="350px"
// 					backgroundColor="white"
// 					borderRadius="8px"
// 					border="2px solid #E8EBFF"
// 					_focus={{
// 						boxShadow: 'none',
// 					}}
// 					spacing="4px"
// 					p="8px"
// 				>
// 					<HStack gridGap={5} paddingBottom="30px">
// 						<Image borderRadius="full" boxSize="100px" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
// 						<Text size="2xl"> EXTRA BIG BIG BIG NAME </Text>
// 					</HStack>

// 					<HStack gridGap={5} paddingBottom="50px">
// 						<Stack spacing="16px">
// 							<Stack bg="blue.50" p="8px 50px" w="100%" borderRadius="8px">
// 								<Text>
// 									<Box
// 										as="span"
// 										bgClip="text"
// 										bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 										fontWeight="700"
// 									>
// 										Change my name
// 									</Box>
// 								</Text>
// 							</Stack>
// 						</Stack>

// 						<Stack spacing="16px">
// 							<Stack bg="blue.50" p="8px 50px" w="100%" borderRadius="8px">
// 								<Text>
// 									<Box
// 										as="span"
// 										bgClip="text"
// 										bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 										fontWeight="700"
// 									>
// 										Change my avatar
// 									</Box>
// 								</Text>
// 							</Stack>
// 						</Stack>
// 					</HStack>

// 					<VStack rowGap={3}>
// 						<Text size="l"> My address: 0xf4745149595169419541949C4949419F1148</Text>
// 						<Text size="l"> My public key: 0xf4745149595169419541949C4949419F1148</Text>
// 					</VStack>
// 				</VStack>

// 				<VStack
// 					w="500px"
// 					h="150px"
// 					backgroundColor="white"
// 					borderRadius="8px"
// 					border="2px solid #E8EBFF"
// 					_focus={{
// 						boxShadow: 'none',
// 					}}
// 					spacing="4px"
// 					p="8px"
// 				>
// 					<HStack gridGap={5} paddingBottom="30px">
// 						<Image borderRadius="full" boxSize="50px" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
// 						<Text size="xl"> Github connection </Text>
// 					</HStack>

// 					<Stack spacing="16px">
// 						<Stack bg="blue.50" p="8px 50px" w="100%" borderRadius="8px">
// 							<Text>
// 								<Box
// 									as="span"
// 									bgClip="text"
// 									bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
// 									fontWeight="700"
// 								>
// 									Sign off of github
// 								</Box>
// 							</Text>
// 						</Stack>
// 					</Stack>
// 				</VStack>
// 			</HStack>

// 			<HStack gridGap={5}>
// 				<VStack
// 					w="375px"
// 					h="100px"
// 					backgroundColor="white"
// 					borderRadius="8px"
// 					border="2px solid #E8EBFF"
// 					_focus={{
// 						boxShadow: 'none',
// 					}}
// 					spacing="4px"
// 					p="8px"
// 				>
// 					<Text size="xl">Theme</Text>
// 					<HStack>
// 						<Stack spacing="16px">
// 							<Stack bg="blue.50" p="8px 30px" w="100%" borderRadius="8px">
// 								<Text>
// 									<Box
// 										as="span"
// 										bgClip="text"
// 										bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 										fontWeight="700"
// 									>
// 										Light theme
// 									</Box>
// 								</Text>
// 							</Stack>
// 						</Stack>

// 						<Stack spacing="16px">
// 							<Stack bg="blue.50" p="8px 30px" w="100%" borderRadius="8px">
// 								<Text>
// 									<Box
// 										as="span"
// 										bgClip="text"
// 										bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 										fontWeight="700"
// 									>
// 										Dark theme
// 									</Box>
// 								</Text>
// 							</Stack>
// 						</Stack>
// 					</HStack>
// 				</VStack>

// 				<VStack
// 					w="375px"
// 					h="100px"
// 					backgroundColor="white"
// 					borderRadius="8px"
// 					border="2px solid #E8EBFF"
// 					_focus={{
// 						boxShadow: 'none',
// 					}}
// 					spacing="4px"
// 					p="8px"
// 				>
// 					<Text size="xl">Default Entrypoint</Text>
// 					<Stack spacing="16px">
// 						<Stack bg="blue.50" p="8px 30px" w="100%" borderRadius="8px">
// 							<Text>
// 								<Box
// 									as="span"
// 									bgClip="text"
// 									bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 									fontWeight="700"
// 								>
// 									main:app
// 								</Box>
// 							</Text>
// 						</Stack>
// 					</Stack>
// 				</VStack>
// 				<VStack
// 					w="375px"
// 					h="100px"
// 					backgroundColor="white"
// 					borderRadius="8px"
// 					border="2px solid #E8EBFF"
// 					_focus={{
// 						boxShadow: 'none',
// 					}}
// 					spacing="4px"
// 					p="8px"
// 				>
// 					<Text size="xl">Default Name</Text>
// 					<Stack spacing="16px">
// 						<Stack bg="blue.50" p="8px 30px" w="100%" borderRadius="8px">
// 							<Text>
// 								<Box
// 									as="span"
// 									bgClip="text"
// 									bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.blue[900]} 100%)`}
// 									fontWeight="700"
// 								>
// 									[userName]@[repositoryName]
// 								</Box>
// 							</Text>
// 						</Stack>
// 					</Stack>
// 				</VStack>
// 			</HStack>

// 			{/* <Text fontSize="3xl" color={colorText}>
// 				InterPlanetaryCloud Configuration
// 			</Text>
// 			<Box borderWidth="2px" w="90%" h="750px">
// 				<BsCode size="25" color={colorText}></BsCode>
// 				<HStack>
// 					<Text marginLeft="30" textColor={colorText}>
// 						Theme (Dark or Light)
// 					</Text>
// 					<Input onChange={Theme} w="60%"></Input>
// 				</HStack>
// 				<BsCodeSlash size="25" color={colorText}></BsCodeSlash>
// 			</Box>
// 			<Button
// 				onClick={configUser}
// 				w="90%"
// 				backgroundColor={color}
// 				textColor={colorText}
// 				justifyContent="center"
// 				isLoading={isLoading}
// 			>
// 				Save
// 			</Button> */}
// 		</>
// 	);
// };

// export default ConfigPage;
