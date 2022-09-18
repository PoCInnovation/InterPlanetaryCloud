import { CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Tooltip, VStack } from '@chakra-ui/react';

import ContactCard from 'components/ContactCard';

import type { IPCContact } from 'types/types';

import AddContact from 'components/contact/AddContact';
import DeleteContact from 'components/contact/DeleteContact';
import UpdateContact from 'components/contact/UpdateContact';

type ContactCardsProps = {
	contacts: IPCContact[];
};

const ContactCards = ({ contacts }: ContactCardsProps): JSX.Element => (
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
				<AddContact />
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
								<UpdateContact contact={contact} />
							</Tooltip>
							<Tooltip label="Delete the contact">
								<DeleteContact contact={contact} />
							</Tooltip>
						</>
					</ContactCard>
				);
			return <Divider key={contact.publicKey} />;
		})}
	</>
);

export default ContactCards;
