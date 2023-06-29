import { Text, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

const LabelBadge = ({ label }: { label: string }): JSX.Element => (
	<VStack p="4px 48px" bg="blue.100" border={`1px solid ${colors.blue['300']}`} borderRadius="8px">
		<Text size="xl" variant="gradient">
			{label}
		</Text>
	</VStack>
);

export default LabelBadge;
