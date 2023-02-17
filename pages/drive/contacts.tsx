import { HStack, Text, VStack } from '@chakra-ui/react';
import Button from 'components/Button';
import { BsPlusLg } from 'react-icons/bs';
import colors from 'theme/foundations/colors';
import { useDriveContext } from '../../src/contexts/drive';
import Navigation from '../../src/components/navigation/Navigation';
import DriveCards from '../../src/components/cards/DriveCards';
import LabelBadge from '../../src/components/LabelBadge';
import AddContact from "../../src/components/contact/AddContact";

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
