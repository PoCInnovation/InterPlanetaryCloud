import {
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Portal,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { IPCProgram } from 'types/types';

import { useConfigContext } from 'contexts/config';

import DeployProgram from 'components/computing/programs/DeployProgram';
import GoToWebsiteProgram from 'components/programs/GoToWebsiteProgram';

const ProgramOptionsContent = ({ program, programs }: { program: IPCProgram; programs: IPCProgram[] }): JSX.Element => (
	<>
		<GoToWebsiteProgram program={program} />
		<DeployProgram selectedProgram={program} />
	</>
);

const ProgramOptionsPopover = ({
	program,
	programs,
	clickPosition,
	popoverOpeningToggle,
	popoverOpeningHandler,
}: {
	program: IPCProgram;
	programs: IPCProgram[];
	clickPosition: { x: number; y: number };
	popoverOpeningToggle: boolean;
	popoverOpeningHandler: () => void;
}): JSX.Element => {
	const { config } = useConfigContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		if (popoverOpeningToggle) {
			popoverOpeningHandler();
			onOpen();
		}
	}, [popoverOpeningToggle]);

	return (
		<Popover placement="right-start" isOpen={isOpen} onClose={() => onClose()}>
			<PopoverTrigger>
				<Box position="fixed" w="1px" h="1px" bg="transparent" top={clickPosition.y} left={clickPosition.x} />
			</PopoverTrigger>
			<Portal>
				<PopoverContent
					w="250px"
					backgroundColor={config?.theme ?? 'white'}
					borderRadius="8px"
					border="2px solid #E8EBFF"
					_focus={{
						boxShadow: 'none',
					}}
				>
					<PopoverBody p="8px">
						<VStack w="100%" spacing="4px">
							<ProgramOptionsContent program={program} programs={programs} />
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

const ProgramOptionsDrawer = ({
	program,
	programs,
	isOpen,
	onClose,
}: {
	program: IPCProgram;
	programs: IPCProgram[];
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element => (
	<Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
		<DrawerOverlay />
		<DrawerContent borderRadius="16px 16px 0px 0px">
			<DrawerBody px="16px" py="32px">
				<VStack w="100%" spacing="12px">
					<ProgramOptionsContent program={program} programs={programs} />
				</VStack>
			</DrawerBody>
		</DrawerContent>
	</Drawer>
);

export { ProgramOptionsPopover, ProgramOptionsDrawer };
