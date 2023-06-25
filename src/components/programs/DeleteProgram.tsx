import {
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoTrashSharp } from 'react-icons/io5';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import type { IPCProgram } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DeleteProgramProps = {
	program: IPCProgram;
};

const DeleteProgram = ({ program }: DeleteProgramProps): JSX.Element => {
	const { user } = useUserContext();
	const { programs, setPrograms } = useDriveContext();

	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	const deleteActualProgram = async () => {
		setIsLoading(true);
		const update = await user.fullContact.computing.delete(program.hash);
		if (update.success) setPrograms(programs.filter((f) => f.hash !== program.hash));
		setIsLoading(false);
		onClose();
	};

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-delete-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={IoTrashSharp}
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
				Delete
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete program"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={deleteActualProgram}
						isLoading={isLoading}
						id="ipc-dashboard-delete-program-button"
					>
						Delete
					</Button>
				}
			>
				<Text color={textColor}>Are you sure you want to delete this program?</Text>
			</Modal>
		</HStack>
	);
};

export default DeleteProgram;
