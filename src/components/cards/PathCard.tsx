import { Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useDriveContext } from 'contexts/drive';
import { useConfigContext } from 'contexts/config';

const PathCard = (): JSX.Element => {
	const { path, setPath } = useDriveContext();
	const colorText = useColorModeValue('gray.800', 'white');
	const colorShadow = useColorModeValue('1px 2px 3px 3px rgb(240, 240, 240)', '1px 2px 3px 3px rgb(66, 66, 66)');
	const { config } = useConfigContext();

	if (path === '/') return <></>;

	return (
		<HStack w="100%">
			<Button
				backgroundColor={config?.theme}
				size="sm"
				w="10%"
				p="0px"
				mx="4px"
				boxShadow={colorShadow}
				onClick={() => {
					console.log('eher');
					setPath(path.replace(/([^/]+)\/$/, ''));
				}}
				id="ipc-dashboard-back-path-button"
			>
				<ArrowBackIcon fontSize="30" color={colorText} />
			</Button>
			<Text fontWeight="500" isTruncated>
				{path}
			</Text>
		</HStack>
	);
};

export default PathCard;
