import {
	Divider,
	HStack,
	Icon,
	Select,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { BsShareFill } from 'react-icons/bs';

import Modal from 'components/Modal';

import { useUserContext } from 'contexts/user';

import Avatar from 'boring-avatars';
import Button from 'components/Button';
import Card from 'components/cards/Card';
import { hoverColorMode, textColorMode } from 'config/colorMode';
import colors from 'theme/foundations/colors';
import type { IPCContact, IPCFile, IPCPermission } from 'types/types';

type ShareFileProps = {
	file: IPCFile;
	onClosePopover: () => void;
};

const ShareFile = ({ file, onClosePopover }: ShareFileProps): JSX.Element => {
	const { user } = useUserContext();

	const [contact, setContact] = useState<IPCContact | null>(null);
	const [permission, setPermission] = useState<IPCPermission>('viewer');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const shareFile = async () => {
		setIsLoading(true);
		const share = await user.fullContact.files.addFileToContact(contact!.address, { ...file, permission });

		toast({ title: share.message, status: share.success ? 'success' : 'error' });
		onUnmount();
		onClosePopover();
	};

	const onUnmount = () => {
		setIsLoading(false);
		setContact(null);
		setPermission('viewer');
		onClose();
	};

	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const hoverColor = useColorModeValue(hoverColorMode.light, hoverColorMode.dark);
	const { colorMode } = useColorMode();

	if (file.permission !== 'owner') return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-share-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={BsShareFill}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize="16px"
				fontWeight="400"
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={textColor}
			>
				Share
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onUnmount}
				title={contact ? 'Choose the given permissions' : 'Select your contact'}
				CTA={
					contact ? (
						<Button
							variant="primary"
							size="lg"
							id="ipc-dashboard-confirm-share-file-button"
							onClick={shareFile}
							isLoading={isLoading}
						>
							Share
						</Button>
					) : (
						<></>
					)
				}
			>
				<VStack spacing="16px" overflowY="auto">
					{!contact &&
						user.fullContact.contact.contacts.map((c) => {
							if (c.address !== user.account.address)
								return (
									<Card
										key={c.address}
										w="100%"
										onClick={() => setContact(c)}
										cursor="pointer"
										_hover={{ bg: hoverColor }}
									>
										<HStack spacing="32px">
											<Avatar
												size="48"
												name={user.account.address}
												variant="marble"
												colors={[
													colors.red['1000'],
													colors.blue['1100'],
													colors.red['500'],
													colors.gray['100'],
													colors.blue['500'],
												]}
											/>
											<VStack key={c.address} w="100%" align="start">
												<Text fontWeight="600" color={textColor}>
													{c.name}
												</Text>
												<Text fontSize="12px" color={textColor}>
													{c.address}
												</Text>
											</VStack>
										</HStack>
									</Card>
								);
							return <Divider key={c.address} />;
						})}
					{contact && (
						<Select
							onChange={(e: ChangeEvent<HTMLSelectElement>) => setPermission(e.target.value as IPCPermission)}
							value={permission}
						>
							<option value="viewer">Viewer</option>
							<option value="editor">Editor</option>
						</Select>
					)}
				</VStack>
			</Modal>
		</HStack>
	);
};

export default ShareFile;
