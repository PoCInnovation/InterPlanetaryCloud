import { Text } from '@chakra-ui/react';
import { useUserContext } from 'contexts/user';

const Dashboard = (): JSX.Element => {
	const { user } = useUserContext();

	return (
		<>
			<Text>{user.account?.name}</Text>
		</>
	);
};

export default Dashboard;
