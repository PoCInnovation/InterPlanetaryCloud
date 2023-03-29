import { HStack, Icon, Text, useBreakpointValue, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { IoEarth } from 'react-icons/io5';

import type { IPCProgram } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DownloadFileProps = {
	program: IPCProgram;
};

const GoToWebsiteProgram = ({ program }: DownloadFileProps): JSX.Element => {
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={() => window.open(`https://aleph.sh/vm/${program.hash}`)}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-download-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={IoEarth}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize="16px"
				fontWeight="400"
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={textColor}
			>
				Go to website
			</Text>
		</HStack>
	);
};

export default GoToWebsiteProgram;
