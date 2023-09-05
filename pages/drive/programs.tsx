import {VStack} from '@chakra-ui/react';

import DriveCards from 'components/cards/DriveCards';
import LabelBadge from 'components/LabelBadge';

import {useDriveContext} from 'contexts/drive';

const Programs = (): JSX.Element => {
    const {programs} = useDriveContext();

    return (
        <VStack w="100%" spacing="48px" align="start">
            <LabelBadge label="My programs"/>
            <DriveCards programs={programs}/>
        </VStack>
    );
};

export default Programs;
