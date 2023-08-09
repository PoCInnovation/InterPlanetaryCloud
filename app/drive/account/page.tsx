'use client';

import {VStack} from '@chakra-ui/react';

import AccountCard from 'components/account/AccountCard';
import ConfigCard from 'components/account/ConfigCard';
import LabelBadge from 'components/LabelBadge';

const Account = (): JSX.Element => (
    <VStack w="100%" spacing="48px" align="start">
        <LabelBadge label="Account"/>
        <AccountCard/>
        <ConfigCard/>
    </VStack>
);

export default Account;
