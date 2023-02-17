import { HStack, VStack } from '@chakra-ui/react';

import Navigation from 'components/navigation/Navigation';
import DriveCards from 'components/cards/DriveCards';
import LabelBadge from 'components/LabelBadge';
import AddContact from 'components/contact/AddContact';

import { useDriveContext } from 'contexts/drive';

const Contacts = (): JSX.Element => {
	const { contacts } = useDriveContext();

	return (
		<Navigation>
			<VStack w="100%" id="test" spacing="48px" align="start">
				<HStack spacing="48px">
					<LabelBadge label="Contacts" />
					<AddContact />
				</HStack>
				<DriveCards contacts={contacts} />
			</VStack>
		</Navigation>
	);
};

export default Contacts;
