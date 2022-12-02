import { HStack, Icon, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { AiOutlineCode } from 'react-icons/ai';
import ProgramModal from './ProgramModal';
import { IPCProgram } from '../../../types/types';

const DeployProgram = ({ selectedProgram }: { selectedProgram?: IPCProgram }): JSX.Element => {
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
			id="ipc-dashboard-deploy-program-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={AiOutlineCode}
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
				Deploy a program
			</Text>
			<ProgramModal isOpen={isOpen} onClose={onClose} selectedProgram={selectedProgram} />
		</HStack>
	);
};

export default DeployProgram;
