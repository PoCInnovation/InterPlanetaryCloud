import {
	Box,
	Button,
	HStack,
	Image, Stack,
	Text,
	useColorMode, useToast,
	VStack,
	Wrap,
	WrapItem
} from '@chakra-ui/react';
import Card from 'components/cards/Card';
import { useUserContext } from 'contexts/user';
import {useState} from "react";
import colors from "../../theme/foundations/colors";
import {useConfigContext} from "../../contexts/config";

const ConfigCard = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const toast = useToast();
	const { toggleColorMode } = useColorMode();

	const [isLoading, setIsLoading] = useState(false);
	const [colorTheme, setColorTheme] = useState(user.config!.theme);

	const switchTheme = async () => {
		setIsLoading(true);
		setColorTheme(colorTheme === "light" ? "dark" : "light");
		try {
			const config1 = await user.contact.configFile(colorTheme);
			setConfig({ ...user.config!, theme: colorTheme });
			toggleColorMode();
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: 'Failed to change theme', status: 'error' });
			console.error(error);
		}
		setIsLoading(false);
	};

	const isLight = colorTheme === "light";

	return (
		<Wrap>
			<WrapItem>
				<Card size="md">
					<VStack align="start" spacing="64px">
						<VStack spacing="32px" align="start">
							<HStack spacing="16px">
								<Text size="xl">Configuration</Text>
							</HStack>
							<HStack spacing="16px">
								<Button variant={isLight ? "primary" : "secondary"} disabled={isLight} isLoading={isLoading} onClick={switchTheme} size="md">
									Light theme
								</Button>
								<Button variant={!isLight ? "primary" : "secondary"} disabled={!isLight} isLoading={isLoading} onClick={switchTheme} size="md">
									Dark theme
								</Button>
							</HStack>
						</VStack>
						<VStack
							w="400px"
							h="150px"
							backgroundColor="white"
							borderRadius="8px"
							border="2px solid #E8EBFF"
							_focus={{
								boxShadow: 'none',
							}}
							spacing="4px"
							p="8px"
						>
							<HStack gridGap={5} paddingBottom="30px">
								<Image borderRadius="full" boxSize="50px" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
								<Text size="xl"> Github connection </Text>
							</HStack>

							<Stack spacing="16px">
								<Stack bg="blue.50" p="8px 50px" w="100%" borderRadius="8px">
									<Text>
										<Box
											as="span"
											bgClip="text"
											bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
											fontWeight="700"
										>
											Sign off of github
										</Box>
									</Text>
								</Stack>
							</Stack>
						</VStack>
					</VStack>
				</Card>
			</WrapItem>
		</Wrap>
	);
};

export default ConfigCard;
