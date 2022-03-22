import React from 'react';
import { Box, Button, Divider, Tooltip, VStack } from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IPCContact } from '../types/types';
import { ContactCard } from './ContactCard';

type ContactCardsProps = {
	contacts: IPCContact[];
	setContactInfo: React.Dispatch<React.SetStateAction<IPCContact>>;
	onOpenContactUpdate: () => void;
	onOpenContactAdd: () => void;
	deleteContact: (contactToDelete: IPCContact) => Promise<void>;
};

export const ContactCards = ({
	contacts,
	setContactInfo,
	onOpenContactUpdate,
	onOpenContactAdd,
	deleteContact,
}: ContactCardsProps): JSX.Element => (
	<>
		<Box
			p="16px"
			bg="white"
			w="100%"
			boxShadow="0px 2px 3px 3px rgb(240, 240, 240)"
			borderRadius="4px"
			border="1px solid rgb(200, 200, 200)"
			mb="8px"
			display="flex"
			justifyContent="space-between"
		>
			<VStack w="100%" justify="space-between" align="center">
				<Button variant="inline" onClick={onOpenContactAdd}>
					Add a contact
				</Button>
			</VStack>
		</Box>
		{contacts.map((contact, index) => {
			if (index !== 0)
				return (
					<ContactCard key={contact.publicKey} contact={contact}>
						<>
							<Tooltip label="Copy the public key of the contact">
								<Button
									size="sm"
									w="100%"
									p="0px"
									mx="4px"
									onClick={async () => {
										await navigator.clipboard.writeText(contact.publicKey);
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
				);
			return <Divider key={contact.publicKey} />;
		})}
	</>
);
