import {
	Button,
	Divider,
	Flex,
	HStack,
	Icon,
	Select,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { BsShareFill } from 'react-icons/bs';

import Modal from 'components/Modal';

import { useUserContext } from 'contexts/user';

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
		const share = await user.contact.addFileToContact(contact!.address, { ...file, permission });

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
				bg: 'blue.100',
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
							variant="inline"
							w="100%"
							mb="16px"
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
						user.contact.contacts.map((c) => {
							if (c.address !== user.account?.address)
								return (
									<Flex key={c.address} w="100%" justifyContent="center" onClick={() => setContact(c)}>
										<VStack key={c.address}>
											<Text fontWeight="600">{c.name}</Text>
											<Text fontSize="12px">{c.address}</Text>
										</VStack>
									</Flex>
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
