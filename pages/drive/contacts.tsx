import {HStack, VStack} from '@chakra-ui/react';

import DriveCards from 'components/Models/cards/DriveCards';
import AddContact from 'components/contact/AddContact';
import LabelBadge from 'components/Models/LabelBadge';
import Navigation from 'components/Pages/navigation/Navigation';

import {useDriveContext} from 'contexts/drive';

const Contacts = (): JSX.Element => {
  const {contacts} = useDriveContext();

  return (
    <Navigation>
      <VStack w="100%" spacing="48px" align="start">
        <HStack spacing="48px">
          <LabelBadge label="Contacts"/>
          <AddContact/>
        </HStack>
        <DriveCards contacts={contacts}/>
      </VStack>
    </Navigation>
  );
};

export default Contacts;
