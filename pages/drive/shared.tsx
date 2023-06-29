import {VStack} from '@chakra-ui/react';

import DriveCards from 'components/Models/cards/DriveCards';
import LabelBadge from 'components/Models/LabelBadge';
import Navigation from 'components/Pages/navigation/Navigation';

import {useDriveContext} from 'contexts/drive';

const Shared = (): JSX.Element => {
  const {sharedFiles} = useDriveContext();
  const {sharedPrograms} = useDriveContext();

  return (
    <Navigation>
      <VStack w="100%" spacing="48px" align="start">
        <LabelBadge label="Share with me"/>
        <DriveCards files={sharedFiles.filter((elem) => !elem.deletedAt)} programs={sharedPrograms}/>
      </VStack>
    </Navigation>
  );
};

export default Shared;
