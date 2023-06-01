import { DeleteIcon } from '@chakra-ui/icons';
import { Button, useToast } from '@chakra-ui/react';

import type { IPCContact } from 'types/types';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type DeleteContactProps = {
	contact: IPCContact;
};

const DeleteContact = ({ contact }: DeleteContactProps): JSX.Element => {
	const { user } = useUserContext();
	const { setContacts } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const deleteContact = async () => {
		const deletedContact = user.fullContact.contact.contacts.find((c) => c === contact);

		if (deletedContact) {
			const deleteResponse = await user.fullContact.contact.remove(contact.address);

			toast({ title: deleteResponse.message, status: deleteResponse.success ? 'success' : 'error' });
			setContacts(user.fullContact.contact.contacts);
		} else {
			toast({ title: 'Unable to find this contact', status: 'error' });
		}
	};

	return (
		<Button size="sm" w="100%" mx="4px" p="0px" onClick={deleteContact}>
			<DeleteIcon />
		</Button>
	);
};

export default DeleteContact;
