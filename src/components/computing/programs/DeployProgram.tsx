import {
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineCode } from 'react-icons/ai';
import { IoIosRocket } from 'react-icons/io';

import { IPCProgram } from 'types/types';

import { textColorMode } from 'config/colorMode';

import ProgramModal from './ProgramModal';

const DeployProgram = ({ selectedProgram }: { selectedProgram?: IPCProgram }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-deploy-program-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={selectedProgram ? IoIosRocket : AiOutlineCode}
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
				{selectedProgram ? 'Redeploy' : 'Deploy a program'}
			</Text>
			<ProgramModal isOpen={isOpen} onClose={onClose} selectedProgram={selectedProgram} />
		</HStack>
	);
};

export default DeployProgram;
