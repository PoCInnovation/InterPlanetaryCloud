import { HStack, Icon, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { IPCFile } from 'types/types';

const DetailsFile = ({ file }: { file: IPCFile }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
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
			>
				Details
			</Text>
		</HStack>
	);
};

export default DetailsFile;
