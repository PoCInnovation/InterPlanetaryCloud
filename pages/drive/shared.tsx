import { Text, VStack } from '@chakra-ui/react';
import DriveCards from '../../src/components/cards/DriveCards';
import Navigation from '../../src/components/navigation/Navigation';
import { useDriveContext } from '../../src/contexts/drive';

const Shared = (): JSX.Element => {
	const { sharedFiles } = useDriveContext();

	return (
		<Navigation>
			<VStack w="100%" id="test" spacing="16px">
				<DriveCards files={sharedFiles.filter((elem) => !elem.deletedAt)} />
			</VStack>
		</Navigation>
	);
};

export default Shared;
