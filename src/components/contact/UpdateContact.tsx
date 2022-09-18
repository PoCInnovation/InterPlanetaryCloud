import { EditIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormLabel, Input, useDisclosure, useToast } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

import Modal from 'components/Modal';

import type { IPCContact } from 'types/types';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type UpdateContactProps = {
	contact: IPCContact;
};

const UpdateContact = ({ contact }: UpdateContactProps): JSX.Element => {
	const { user } = useUserContext();
	const { setContacts } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const updateContact = async () => {
		setIsLoading(true);
		if (name) {
			const update = await user.contact.update(contact.address, name);
			toast({ title: update.message, status: update.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
		} else {
			toast({ title: 'Invalid name', status: 'error' });
		}
		setName('');
		setIsLoading(true);
		onClose();
	};

	return (
		<>
			<Button size="sm" w="100%" p="0px" mx="4px" onClick={() => onOpen()}>
				<EditIcon />
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Update the contact"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={updateContact}
						isLoading={isLoading}
						id="ipc-dashboard-update-contact-button"
					>
						Update the contact
					</Button>
				}
			>
				<FormControl>
					<FormLabel>New name</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder={contact.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-contact-name"
					/>
				</FormControl>
			</Modal>
		</>
	);
};

export default UpdateContact;
