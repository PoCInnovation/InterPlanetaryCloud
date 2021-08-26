import { useUserContext } from 'contexts/user';

import { Text } from '@chakra-ui/react';

const Dashboard = (): JSX.Element => {
	const { user } = useUserContext();

	console.log(user);

	return (
		<>
			<Text>This is the dashboard</Text>
		</>
	);
};

export default Dashboard;
