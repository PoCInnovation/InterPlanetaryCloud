import {VStack} from '@chakra-ui/react';

import Navigation from 'components/navigation/Navigation';
import LabelBadge from "components/LabelBadge";
import AccountCard from 'components/account/AccountCard';
import React from "react";
import ConfigCard from "../../src/components/account/ConfigCard";

const Account = (): JSX.Element => (
	<Navigation>
		<VStack w="100%" spacing="48px" align="start">
			<LabelBadge label="Account" />
			<AccountCard />
			<ConfigCard />
		</VStack>
	</Navigation>
);

export default Account;
