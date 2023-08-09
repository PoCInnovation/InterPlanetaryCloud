'use client';

import {HStack, VStack} from '@chakra-ui/react';

import DriveCards from 'components/cards/DriveCards';
import AddContact from 'components/contact/AddContact';
import LabelBadge from 'components/LabelBadge';

import {useDriveContext} from 'contexts/drive';

const Contacts = (): JSX.Element => {
    const {contacts} = useDriveContext();

    return (
        <VStack w="100%" spacing="48px" align="start">
            <HStack spacing="48px">
                <LabelBadge label="Contacts"/>
                <AddContact/>
            </HStack>
            <DriveCards contacts={contacts}/>
        </VStack>
    );
};

export default Contacts;
