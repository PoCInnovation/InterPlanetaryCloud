import {
	Button,
	Divider,
	Flex,
	HStack,
	PopoverHeader,
	Select,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { FcShare } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCContact, IPCFile, IPCPermission } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

type ShareFileProps = {
	file: IPCFile;
};

const ShareFile = ({ file }: ShareFileProps): JSX.Element => {
	const { user } = useUserContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [contact, setContact] = useState<IPCContact | null>(null);
	const [permission, setPermission] = useState<IPCPermission>('viewer');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const shareFile = async () => {
		setIsLoading(true);
		const share = await user.contact.addFileToContact(contact!.address, { ...file, permission });

		toast({ title: share.message, status: share.success ? 'success' : 'error' });
		onUnmount();
	};

	const onUnmount = () => {
		setIsLoading(false);
		setContact(null);
		setPermission('viewer');
		onClose();
	};

	if (file.permission !== 'owner') return <></>;

	return (
		<PopoverHeader>
			<HStack>
				<FcShare size="30"></FcShare>
				<Button
					backgroundColor={config?.theme ?? 'white'}
					textColor={colorText}
					w="100%"
					p="0px"
					mx="4px"
					onClick={onOpen}
					id="ipc-dashboard-share-file-button"
				>
					Share
				</Button>
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
		</PopoverHeader>
	);
};

export default ShareFile;
