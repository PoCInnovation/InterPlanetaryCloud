import { useState, useEffect } from 'react';
import { Button, Divider, Flex, HStack, Text, Spacer, VStack, useToast, useDisclosure } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { FcShare } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile, IPCContact } from 'types/types';

import { useUserContext } from 'contexts/user';

type ShareFileProps = {
	file: IPCFile;
};

const ShareFile = ({ file }: ShareFileProps): JSX.Element => {
	const { user } = useUserContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const [hasPermission, setHasPermission] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => setHasPermission(false);
	}, []);

	const shareFile = async (contact: IPCContact) => {
		const share = await user.contact.addFileToContact(contact.address, file);

		toast({ title: share.message, status: share.success ? 'success' : 'error' });
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcShare size="30"></FcShare>
			<Button
				backgroundColor={'white'}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={() => onOpen()}
				id="ipc-dashboard-share-file-button"
			>
				Share
			</Button>
			<Modal isOpen={isOpen} onClose={onClose} title="Select your contact">
				<VStack spacing="16px" overflowY="auto">
					{user.contact.contacts.map((contact) => {
						if (user.account && contact.address !== user.account.address)
							return (
								<Flex key={contact.address} w="100%">
									<VStack key={contact.address}>
										<Text fontWeight="600">{contact.name}</Text>
										<Text fontSize="12px">{contact.address}</Text>
									</VStack>
									<Spacer />
									<Button p="0px" mx="4px" variant="inline" onClick={async () => shareFile(contact)}>
										<CheckIcon />
									</Button>
								</Flex>
							);
						return <Divider key={contact.address} />;
					})}
				</VStack>
			</Modal>
		</HStack>
	);
};

export default ShareFile;
