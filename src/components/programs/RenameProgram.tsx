import {
	HStack,
	FormControl,
	FormLabel,
	Input,
	useDisclosure,
	Icon,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue
} from '@chakra-ui/react';

import { BsPencil } from 'react-icons/bs';

import type { IPCProgram } from 'types/types';

import { textColorMode } from 'config/colorMode';


import Modal from 'components/Modal';
import Button from 'components/Button';

import { ChangeEvent, useState } from 'react';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';



type RenameProgramProps = {
	program: IPCProgram;
	concernedPrograms: IPCProgram[];
	onClosePopover: () => void;
};

const RenameProgram =  ({ program , concernedPrograms, onClosePopover}: RenameProgramProps): JSX.Element =>  {
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const { colorMode } = useColorMode();
	const { user } = useUserContext();
	const [name, setName] = useState('');
	const {programs, setPrograms} = useDriveContext();

	const updateProgramName = async () => {
		setIsLoading(true);
		if (name) {
			const update = await user.contact.updateProgramName(program, name, concernedPrograms);
			if (update.success) {
				const index = programs.indexOf(program);

				if (index !== -1) {
					programs[index].name = name;
					programs[index].logs.push({
						action: `Renamed file to ${name}`,
						date: Date.now(),
					});
				}
				setPrograms([...programs]);
			}
		}
		setName('');
		setIsLoading(false);
		onClose();
		onClosePopover();
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
			id="ipc-dashboard-download-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={BsPencil}
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
				Rename
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Rename the program"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={updateProgramName}
						isLoading={isLoading}
						id="ipc-dashboard-update-programName-button"
					>
						OK
					</Button>
				}
			>
				<FormControl>
					<FormLabel color={textColor}>New program name</FormLabel>
					<Input
						type="text"
						w="100%"
						p="10px"
						my="4px"
						placeholder={program.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						id="ipc-dashboard-input-update-programame"
					/>
				</FormControl>
			</Modal>
		</HStack>
	);
}

export default RenameProgram;
