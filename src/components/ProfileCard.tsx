import { Box, VStack, Text, Flex, Tooltip, Button } from '@chakra-ui/react';
import { CopyIcon, EditIcon } from '@chakra-ui/icons';
import React from 'react';
import { IPCContact } from '../types/types';

type ProfileCardProps = {
	profile: IPCContact;
	setContactInfo: React.Dispatch<React.SetStateAction<IPCContact>>;
	onOpenContactUpdate: () => void;
};

export const ProfileCard = ({ profile, setContactInfo, onOpenContactUpdate }: ProfileCardProps): JSX.Element => (
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
			<Text fontWeight="500">{profile.name}</Text>
			<Text fontWeight="500" fontSize="12px">
				{profile.address}
			</Text>
			<Flex w="100%" justify="space-between" align="center">
				<Tooltip label="Copy the public key of the contact">
					<Button
						size="sm"
						w="100%"
						p="0px"
						mx="4px"
						onClick={async () => {
							await navigator.clipboard.writeText(profile.publicKey);
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
							setContactInfo(profile);
							onOpenContactUpdate();
						}}
					>
						<EditIcon />
					</Button>
				</Tooltip>
			</Flex>
		</VStack>
	</Box>
);
