import { useState } from 'react';
import {
	Box,
	Button,
	HStack,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FcFile, FcFolder } from 'react-icons/fc';

import FileCard from 'components/FileCard';
import FolderCard from 'components/FolderCard';

import type { IPCFile, IPCFolder } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';

import useToggle from "hooks/useToggle";

import { FileOptionsDrawer, FileOptionsPopover } from './dashboardPage/FileOptions';
import { FolderOptionsPopover , FolderOptionsDrawer } from './dashboardPage/FolderOptions';

const PathCard = (): JSX.Element => {
	const { path, setPath } = useDriveContext();
	const colorText = useColorModeValue('gray.800', 'white');
	const colorShadow = useColorModeValue('1px 2px 3px 3px rgb(240, 240, 240)', '1px 2px 3px 3px rgb(66, 66, 66)');
	const { config } = useConfigContext();

	if (path === '/') return <></>;

	return (
		<HStack w="100%">
			<Button
				backgroundColor={config?.theme}
				size="sm"
				w="10%"
				p="0px"
				mx="4px"
				boxShadow={colorShadow}
				onClick={() => setPath(path.replace(/([^/]+)\/$/, ''))}
				id="ipc-dashboard-back-path-button"
			>
				<ArrowBackIcon fontSize="30" color={colorText} />
			</Button>
			<Text fontWeight="500" isTruncated>
				{path}
			</Text>
		</HStack>
	);
};

type DriveCardsProps = {
	files: IPCFile[];
	folders: IPCFolder[];
};

const DriveCards = ({ files, folders }: DriveCardsProps): JSX.Element => {
	const { path, setPath } = useDriveContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const { isOpen: isOpenFolder, onOpen: onOpenFolder, onClose: onCloseFolder } = useDisclosure();
	const { isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile } = useDisclosure();

	const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
	const { toggle: popoverOpeningToggleFolder, toggleHandler: popoverOpeningHandlerFolder } = useToggle();
	const { toggle: popoverOpeningToggleFile, toggleHandler: popoverOpeningHandlerFile } = useToggle();

	return (
		<>
			<PathCard />
			{folders.map((folder) => (
				<FolderCard
					key={folder.createdAt}
					onContextMenu={(e) => {
						e.preventDefault();
						if (!isDrawer) {
							setClickPosition({ x: e.clientX, y: e.clientY });
							popoverOpeningHandlerFolder();
						} else onOpenFolder();
					}}
					onClick={(e) => {
						if (isDrawer || e.detail === 2) setPath(`${path + folder.name  }/`);
					}}
					className="ipc-folder-popover-button"
				>
					<>
						<HStack w="100%">
							<FcFolder display="flex" size="30"></FcFolder>
							<Text>{folder.name}</Text>
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
						</HStack>
					</>
				</FolderCard>
			))}
			{files.map((file) => (
				<FileCard
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
					<>
						<HStack>
							<FcFile size="35" />
							<Text>{file.name}</Text>
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
						</HStack>
						<Box w="33%">
							<Text textColor={colorText}>
								{`${new Date(file.createdAt).toString().substring(4, 15).slice(0, 3)} /${new Date(file.createdAt)
									.toString()
									.substring(4, 15)
									.slice(3, 6)} /${new Date(file.createdAt).toString().substring(4, 15).slice(6)}`}
							</Text>
						</Box>
						<Box>
							<Text textColor={colorText}>{file.size / 1000} ko</Text>
						</Box>
					</>
				</FileCard>
			))}
		</>
	);
};

export default DriveCards;
