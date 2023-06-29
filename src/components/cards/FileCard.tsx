import { Box, HStack, Text, useBreakpointValue, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFileEarmarkFill } from 'react-icons/bs';

import { IPCFile } from 'types/types';

import useToggle from 'hooks/useToggle';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import formatDate from 'utils/formatDate';
import formatFileSize from 'utils/formatFileSize';

import { FileOptionsDrawer, FileOptionsPopover } from 'components/dashboardPage/FileOptions';

import { textColorMode } from 'config/colorMode';

import Card from './Card';

const FileCard = ({ file }: { file: IPCFile }): JSX.Element => {
	const { files } = useDriveContext();
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
				key={file.createdAt}
				className="ipc-file-popover-button"
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
						<BsFileEarmarkFill size="24px" />
						<Text color={textColor} size="lg">
							{file.name}
						</Text>
					</HStack>
					<HStack spacing="32px">
						<Text color={textColor}>
							by{' '}
							<Box as="span" fontWeight="600">
								{username}
							</Box>
						</Text>
						<Text color={textColor}>{formatDate(file.createdAt)}</Text>
						<Text color={textColor}>{formatFileSize(file.size)}</Text>
					</HStack>
				</HStack>
			</Card>
			<Box>
				{isDrawer ? (
					<FileOptionsDrawer file={file} files={files} isOpen={isOpenFile} onClose={onCloseFile} />
				) : (
					<FileOptionsPopover
						file={file}
						files={files}
						clickPosition={clickPosition}
						popoverOpeningToggle={popoverOpeningToggleFile}
						popoverOpeningHandler={popoverOpeningHandlerFile}
					/>
				)}
			</Box>
		</>
	);
};

export default FileCard;
