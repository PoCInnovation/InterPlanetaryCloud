import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { textColorMode } from 'config/colorMode';

const PathCard = (): JSX.Element => {
	const { path, setPath } = useDriveContext();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
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
				onClick={() => {
					setPath(path.replace(/([^/]+)\/$/, ''));
				}}
				id="ipc-dashboard-back-path-button"
			>
				<ArrowBackIcon fontSize="30" />
			</Button>
			<Text fontWeight="500" isTruncated color={textColor}>
				{path}
			</Text>
		</HStack>
	);
};

export default PathCard;
