import { useState } from 'react';
import {
	Box,
	HStack,
	Text,
	useColorMode,
	useColorModeValue,
	useToast,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';

import Card from 'components/cards/Card';
import Button from 'components/Button';

import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

import { textColorMode } from 'config/colorMode';
import ConfigModal from "./ConfigModal";

type ConfigOptions = "default name" | "default entrypoint";

const ConfigCard = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const toast = useToast();
	const { colorMode, toggleColorMode } = useColorMode();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [modifiedValue, setModifiedValue] = useState<ConfigOptions>("default name");

	const switchTheme = async () => {
		const colorTheme = colorMode === 'light' ? 'dark' : 'light';

		setIsLoading(true);
		try {
			const config1 = await user.contact.configTheme(colorTheme);
			setConfig({ ...user.config!, theme: colorTheme });
			toggleColorMode();
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: 'Failed to change theme', status: 'error' });
			console.error(error);
		}
		setIsLoading(false);
	};

	const changeConfig = async (value: string, type: ConfigOptions) => {
		setIsLoading(true);
		try {
			const config1 = type === "default name" ? await user.contact.configName(value) : await user.contact.configEntrypoint(value);
			setConfig(type === "default name" ? { ...user.config!, defaultName: value } : { ...user.config!, defaultEntrypoint: value });
			setIsOpen(false);
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: `Failed to change ${type}`, status: 'error' });
			console.error(error);
		}
		setIsLoading(false);
	};

	const isLight = colorMode === 'light';

	return (
		<>
			<ConfigModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				type={modifiedValue}
				defaultValue={modifiedValue === "default name" ? user?.config?.defaultName : user?.config?.defaultEntrypoint}
				validate={(value) => changeConfig(value, modifiedValue)}
			/>
			<Wrap>
				<WrapItem>
					<Card size="md">
						<VStack align="start" spacing="64px">
							<VStack spacing="32px" align="start">
								<HStack spacing="16px">
									<Text color={textColor} size="xl">
										Configuration
									</Text>
								</HStack>
								<HStack spacing="16px">
									<Button
										variant={isLight ? 'primary' : 'secondary'}
										disabled={isLight}
										isLoading={isLoading}
										onClick={switchTheme}
										size="md"
									>
										Light theme
									</Button>
									<Button
										variant={!isLight ? 'primary' : 'secondary'}
										disabled={!isLight}
										isLoading={isLoading}
										onClick={switchTheme}
										size="md"
									>
										Dark theme
									</Button>
								</HStack>
							</VStack>

							<VStack
								w="500px"
								h="200px"
								backgroundColor="white"
								borderRadius="8px"
								border="2px solid #E8EBFF"
								_focus={{
									boxShadow: 'none',
								}}
								spacing="4px"
								p="8px"
							>
								<HStack paddingBottom="30px">
									<Text size="xl"> Programs </Text>
								</HStack>

								<VStack spacing="16px" align="start">
									<Text color={textColor}>
										<Box as="span" fontWeight="500">
											Default name:
										</Box>{' '}
										{user?.config?.defaultName ?? ""}
									</Text>
									<Text color={textColor} maxW="450px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
										<Box as="span" fontWeight="500">
											Default entrypoint:
										</Box>{' '}
										{user?.config?.defaultEntrypoint ?? ""}
									</Text>
								</VStack>

								<VStack align="start" spacing="64px">
									<VStack spacing="32px" align="start">
										<HStack spacing="16px">
											<Button variant="secondary" size="md" cursor="pointer" onClick={() => {
												setModifiedValue("default name");
												setIsOpen(true);
											}}>
												Edit default name
											</Button>
											<Button variant="secondary" size="md" cursor="pointer" onClick={() => {
												setModifiedValue("default entrypoint");
												setIsOpen(true);
											}}>
												Edit default entrypoint
											</Button>
										</HStack>
									</VStack>
								</VStack>
							</VStack>
						</VStack>
					</Card>
				</WrapItem>
			</Wrap>
		</>
	);
};

export default ConfigCard;
