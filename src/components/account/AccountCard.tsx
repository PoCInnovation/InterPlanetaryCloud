import { Box, Button, HStack, Icon, Text, Tooltip, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import Card from 'components/cards/Card';
import colors from 'theme/foundations/colors';
import Avatar from 'boring-avatars';
import { useUserContext } from 'contexts/user';
import { BsClipboard } from 'react-icons/bs';

const AccountCard = (): JSX.Element => {
	const { user } = useUserContext();

	return (
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
								<Text size="xl">{user?.contact.username}</Text>
							</HStack>
							<HStack spacing="16px">
								<Tooltip label="Coming soon..." hasArrow>
									<Button variant="secondary" size="md" cursor="not-allowed">
										Change my name
									</Button>
								</Tooltip>
								<Tooltip label="Coming soon..." hasArrow>
									<Button variant="secondary" size="md" cursor="not-allowed">
										Change my avatar
									</Button>
								</Tooltip>
							</HStack>
						</VStack>
						<VStack spacing="16px" align="start">
							<HStack>
								<Text>
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
								<Text maxW="450px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
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
	);
};

export default AccountCard;
