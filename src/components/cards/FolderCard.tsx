import { Box, HStack, Text, useBreakpointValue, useDisclosure, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import { FaFolder } from 'react-icons/fa';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';
import useToggle from 'hooks/useToggle';

import { FolderOptionsDrawer, FolderOptionsPopover } from 'components/dashboardPage/FolderOptions';
import { IPCFolder } from 'types/types';
import formatDate from 'utils/formatDate';
import Card from './Card';

const FolderCard = ({ folder }: { folder: IPCFolder }): JSX.Element => {
	const { path, setPath } = useDriveContext();
	const {
		user: {
			contact: { username },
		},
	} = useUserContext();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	const { toggle: popoverOpeningToggleFolder, toggleHandler: popoverOpeningHandlerFolder } = useToggle();
	const { isOpen: isOpenFolder, onOpen: onOpenFolder, onClose: onCloseFolder } = useDisclosure();

	const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
	const {colorMode} = useColorMode();

	return (
		<>
			<Card
				key={folder.createdAt}
				onContextMenu={(e) => {
					e.preventDefault();
					if (!isDrawer) {
						setClickPosition({ x: e.clientX, y: e.clientY });
						popoverOpeningHandlerFolder();
					} else onOpenFolder();
				}}
				onClick={() => {
					setPath(`${path + folder.name}/`);
				}}
				className="ipc-folder-popover-button"
				w="100%"
				cursor="pointer"
			>
				<HStack w="100%" justify="space-between">
					<HStack spacing="16px">
						<FaFolder size="24px" />
						<Text color={colorMode} size="lg">{folder.name}</Text>
					</HStack>
					<HStack spacing="32px">
						<Text color={colorMode}>
							by{' '}
							<Box as="span" fontWeight="600">
								{username}
							</Box>
						</Text>
						<Text color={colorMode}>{formatDate(folder.createdAt)}</Text>
					</HStack>
				</HStack>
			</Card>
			<Box>
				{isDrawer ? (
					<FolderOptionsDrawer folder={folder} isOpen={isOpenFolder} onClose={onCloseFolder} />
				) : (
					<FolderOptionsPopover
						folder={folder}
						clickPosition={clickPosition}
						popoverOpeningToggle={popoverOpeningToggleFolder}
						popoverOpeningHandler={popoverOpeningHandlerFolder}
					/>
				)}
			</Box>
		</>
	);
};

export default FolderCard;
