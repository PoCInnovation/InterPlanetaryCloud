import { Button, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import type { IPCContact } from 'types/types';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

type DeleteContactProps = {
	contact: IPCContact;
};

const DeleteContact = ({ contact }: DeleteContactProps): JSX.Element => {
	const { user } = useUserContext();
	const { setContacts } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const deleteContact = async () => {
		const deletedContact = user.contact.contacts.find((c) => c === contact);

		if (deletedContact) {
			const deleteResponse = await user.contact.remove(contact.address);

			toast({ title: deleteResponse.message, status: deleteResponse.success ? 'success' : 'error' });
			setContacts(user.contact.contacts);
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
