import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IPCContact } from '../types/types';
import { ContactCard } from './ContactCard';

type ContactCardsProps = {
	contacts: IPCContact[];
	setContactInfo: React.Dispatch<React.SetStateAction<IPCContact>>;
	onOpenContactUpdate: () => void;
	deleteContact: (contactToDelete: IPCContact) => Promise<void>;
};

export const ContactCards = ({
	contacts,
	setContactInfo,
	onOpenContactUpdate,
	deleteContact,
}: ContactCardsProps): JSX.Element => (
	<>
		{contacts.map((contact) => (
			<ContactCard key={contact.publicKey} contact={contact}>
				<>
					<Tooltip label="Copy address of the contact">
						<Button
							size="sm"
							w="100%"
							p="0px"
							mx="4px"
							onClick={() => {
								navigator.clipboard.writeText(contact.publicKey);
							}}
						>
							<CopyIcon />
						</Button>
					</Tooltip>
					<Tooltip label="Update the contact">
						<Button
							size="sm"
							w="100%"
							p="0px"
							mx="4px"
							onClick={() => {
								setContactInfo(contact);
								onOpenContactUpdate();
							}}
						>
							<EditIcon />
						</Button>
					</Tooltip>
					<Tooltip label="Delete the contact">
						<Button size="sm" w="100%" mx="4px" p="0px" onClick={async () => deleteContact(contact)}>
							<DeleteIcon />
						</Button>
					</Tooltip>
				</>
			</ContactCard>
		))}
	</>
);
