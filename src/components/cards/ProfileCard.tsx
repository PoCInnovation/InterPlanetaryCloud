import { CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text, Tooltip, VStack } from '@chakra-ui/react';

import type { IPCContact } from 'types/types';
import UpdateContact from '../contact/UpdateContact';

type ProfileCardProps = {
	profile: IPCContact;
};

const ProfileCard = ({ profile }: ProfileCardProps): JSX.Element => (
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
					<UpdateContact contact={profile} />
				</Tooltip>
			</Flex>
		</VStack>
	</Box>
);

export default ProfileCard;
