import {
	Box,
	Button,
	HStack,
	Icon,
	Text,
	Tooltip,
	useToast,
	VStack,
	Wrap,
	WrapItem,
	useColorMode
} from '@chakra-ui/react';
import Avatar from 'boring-avatars';
import { BsClipboard } from 'react-icons/bs';

import Card from 'components/cards/Card';

import { useUserContext } from 'contexts/user';

import colors from 'theme/foundations/colors';
import React, {useMemo, useState} from "react";
import ConfigModal from "./ConfigModal";
import {useConfigContext} from "../../contexts/config";

const AccountCard = (): JSX.Element => {
	const { user } = useUserContext();
	const { setConfig } = useConfigContext();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const toast = useToast({ duration: 2000, isClosable: true });

	const changeName = async (name: string, setIsLoading: (isLoading: boolean) => void) => {

		setIsLoading(true);
		try {
			const config1 = await user.contact.update(user.account!.address, name);
			setConfig({ ...user.config!, defaultName: name });
			setIsOpen(false);
			toast({ title: config1.message, status: config1.success ? 'success' : 'error' });
		} catch (error) {
			toast({ title: 'Failed to change name', status: 'error' });
			console.error(error);
		}
		setIsLoading(false);
	};

	const {colorMode} = useColorMode();

	return (
		<>
			<ConfigModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				type="name"
				defaultValue={user?.contact.username}
				validate={changeName}
			/>
			<Wrap>
				<WrapItem>
					<Card size="md">
						<VStack align="start" spacing="64px">
							<VStack spacing="32px" align="start">
								<HStack spacing="16px">
									<Avatar
										size="32"
										name={user?.account?.address}
										variant="marble"
										colors={[
											colors.red['1000'],
											colors.blue['1100'],
											colors.red['500'],
											colors.gray['100'],
											colors.blue['500'],
										]}
									/>
									<Text color={colorMode} size="xl">{user?.contact.username}</Text>
								</HStack>
								<HStack spacing="16px">
									<Button variant="secondary" size="md" cursor="pointer" onClick={() => setIsOpen(true)}>
										Change my name
									</Button>
									<Tooltip label="Coming soon..." hasArrow>
										<Button variant="secondary" size="md" cursor="not-allowed">
											Change my avatar
										</Button>
									</Tooltip>
								</HStack>
							</VStack>
							<VStack spacing="16px" align="start">
								<HStack>
									<Text color={colorMode}>
										<Box as="span" fontWeight="500">
											My address:
										</Box>{' '}
										{user?.account?.address}
									</Text>
									<Icon
										as={BsClipboard}
										w="16px"
										h="16px"
										cursor="pointer"
										onClick={() => navigator.clipboard.writeText(user?.account?.address || '')}
									/>
								</HStack>
								<HStack>
									<Text color={colorMode} maxW="450px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
										<Box as="span" fontWeight="500">
											My public key:
										</Box>{' '}
										{user?.account?.publicKey}
									</Text>
									<Icon
										as={BsClipboard}
										w="16px"
										h="16px"
										cursor="pointer"
										onClick={() => navigator.clipboard.writeText(user?.account?.publicKey || '')}
									/>
								</HStack>
							</VStack>
						</VStack>
					</Card>
				</WrapItem>
			</Wrap>
		</>
	);
};

export default AccountCard;
