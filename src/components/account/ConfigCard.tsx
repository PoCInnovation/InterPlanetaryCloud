import {
	Box,
	Button,
	HStack, Icon,
	Text,
	useColorMode,
	useToast,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import Card from 'components/cards/Card';
import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';
import React, { useState } from 'react';
import { BsClipboard } from "react-icons/bs";

const ConfigCard = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const toast = useToast();
	const { colorMode, toggleColorMode } = useColorMode();

	const [isLoading, setIsLoading] = useState(false);

	const switchTheme = async () => {
		const colorTheme = colorMode === 'light' ? "dark" : "light";

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

	const isLight = colorMode === 'light';

	return (
		<Wrap>
			<WrapItem>
				<Card size="md">
					<VStack align="start" spacing="64px">
						<VStack spacing="32px" align="start">
							<HStack spacing="16px">
								<Text color={colorMode} size="xl">Configuration</Text>
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
							<HStack paddingBottom="30px">
								<Text size="xl"> Programs </Text>
							</HStack>

							<VStack align="start" spacing="64px">
								<VStack spacing="16px" align="start">
									<HStack>
										<Text>
											<Box as="span" fontWeight="500">
												Default name:
											</Box>{' '}
											{user?.config?.defaultName}
										</Text>
										<Icon
											as={BsClipboard}
											w="16px"
											h="16px"
											cursor="pointer"
											onClick={() => navigator.clipboard.writeText(user?.config?.defaultName || '')}
										/>
									</HStack>
									<HStack>
										<Text maxW="450px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
											<Box as="span" fontWeight="500">
												Default entrypoint:
											</Box>{' '}
											{user?.config?.defaultEntrypoint}
										</Text>
										<Icon
											as={BsClipboard}
											w="16px"
											h="16px"
											cursor="pointer"
											onClick={() => navigator.clipboard.writeText(user?.config?.defaultEntrypoint || '')}
										/>
									</HStack>
								</VStack>
							</VStack>
						</VStack>
					</VStack>
				</Card>
			</WrapItem>
		</Wrap>
	);
};

export default ConfigCard;
