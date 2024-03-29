import { Box, HStack, Text, useBreakpointValue, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFileEarmarkCodeFill } from 'react-icons/bs';

import { useUserContext } from 'contexts/user';

import useToggle from 'hooks/useToggle';

import formatDate from 'utils/formatDate';
import formatFileSize from 'utils/formatFileSize';

import { ProgramOptionsDrawer, ProgramOptionsPopover } from 'components/dashboardPage/ProgramOptions';
import { textColorMode } from 'config/colorMode';

import { IPCProgram } from 'types/types';

import Card from './Card';

const ProgramCard = ({ program }: { program: IPCProgram }): JSX.Element => {
	const {
		user: {
			fullContact: {
				contact: { username },
			},
		},
	} = useUserContext();
	const { isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile } = useDisclosure();
	const { toggle: popoverOpeningToggleFile, toggleHandler: popoverOpeningHandlerFile } = useToggle();

	const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	return (
		<>
			<Card
				key={program.createdAt}
				onContextMenu={(e) => {
					e.preventDefault();
					if (!isDrawer) {
						setClickPosition({ x: e.clientX, y: e.clientY });
						popoverOpeningHandlerFile();
					} else onOpenFile();
				}}
			>
				<HStack w="100%" justify="space-between">
					<HStack spacing="16px">
						<BsFileEarmarkCodeFill size="24px" />
						<Text color={textColor} size="lg">
							{program.name} - {program.entrypoint}
						</Text>
					</HStack>
					<HStack spacing="32px">
						<Text color={textColor}>
							by{' '}
							<Box as="span" fontWeight="600">
								{username}
							</Box>
						</Text>
						<Text color={textColor}>{formatDate(program.createdAt)}</Text>
						<Text color={textColor}>{formatFileSize(program.size)}</Text>
					</HStack>
				</HStack>
			</Card>
			<Box>
				{isDrawer ? (
					<ProgramOptionsDrawer program={program} isOpen={isOpenFile} onClose={onCloseFile} />
				) : (
					<ProgramOptionsPopover
						program={program}
						clickPosition={clickPosition}
						popoverOpeningToggle={popoverOpeningToggleFile}
						popoverOpeningHandler={popoverOpeningHandlerFile}
					/>
				)}
			</Box>
		</>
	);
};

export default ProgramCard;
