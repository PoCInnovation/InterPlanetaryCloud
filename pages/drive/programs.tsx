import { VStack } from '@chakra-ui/react';

import Navigation from 'components/navigation/Navigation';
import DriveCards from 'components/cards/DriveCards';

import { useDriveContext } from 'contexts/drive';

const Programs = (): JSX.Element => {
	const { programs } = useDriveContext();

	return (
		<Navigation>
			<VStack w="100%" id="test" spacing="16px">
				<DriveCards programs={programs} />
			</VStack>
		</Navigation>
	);
};

export default Programs;
