'use client';

import { VStack } from '@chakra-ui/react';

import DriveCards from 'components/cards/DriveCards';
import LabelBadge from 'components/LabelBadge';
import Navigation from 'components/navigation/Navigation';

import { useDriveContext } from 'contexts/drive';

const Programs = (): JSX.Element => {
	const { programs } = useDriveContext();

	return (
		<Navigation>
			<VStack w="100%" spacing="48px" align="start">
				<LabelBadge label="My programs" />
				<DriveCards programs={programs} />
			</VStack>
		</Navigation>
	);
};

export default Programs;
