import { HStack, Icon, Text, useBreakpointValue, useDisclosure, useColorMode } from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { IPCFile } from 'types/types';

import DrawerDetailsFile from './DrawerDetailsFile';

const DetailsFile = ({ file, onClosePopover }: { file: IPCFile; onClosePopover: () => void }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={() => {
				onOpen();
				onClosePopover();
			}}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-details-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={AiOutlineInfoCircle}
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
				color={colorMode}
			>
				Details
			</Text>
			<DrawerDetailsFile file={file} isOpen={isOpen} onClose={onClose} />
		</HStack>
	);
};

export default DetailsFile;
