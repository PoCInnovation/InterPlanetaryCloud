import { ChangeEvent, useState } from 'react';
import { Button, Input, useToast, useDisclosure } from '@chakra-ui/react';

import EthCrypto from 'eth-crypto';

import Modal from 'components/Modal';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

const AddContact = (): JSX.Element => {
	const { user } = useUserContext();
	const { setContacts } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const [name, setName] = useState('');
	const [contactPublicKey, setContactPublicKey] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();

	const addContact = async () => {
		if (name && contactPublicKey) {
			const add = await user.contact.add({
				name,
				address: EthCrypto.publicKey.toAddress(contactPublicKey.slice(2)),
				publicKey: contactPublicKey,
				files: [],
				folders: [],
			});

			toast({ title: add.message, status: add.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
		} else {
			toast({ title: 'Bad contact infos', status: 'error' });
		}
		setName('');
		onClose();
	};

	return (
		<>
			<Button variant="inline" onClick={onOpen}>
				Add a contact
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Add the contact"
				CTA={
					<Button variant="inline" w="100%" mb="16px" onClick={addContact} id="ipc-dashboard-add-contact-button">
						Add the contact
					</Button>
				}
			>
				<>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder="Name"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-contact-name"
					/>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder="Public Key"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setContactPublicKey(e.target.value)}
						id="ipc-dashboard-input-contact-public-key"
					/>
				</>
			</Modal>
		</>
	);
};

export default AddContact;
