import { VStack } from '@chakra-ui/react';

import AccountCard from 'components/account/AccountCard';
import ConfigCard from 'components/account/ConfigCard';
import LabelBadge from 'components/LabelBadge';
import Navigation from 'components/navigation/Navigation';

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
