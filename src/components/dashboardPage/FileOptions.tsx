import { useEffect } from 'react';
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

import DownloadFile from 'components/file/DownloadFile';
import ShareFile from 'components/file/ShareFile';
import MoveFile from 'components/file/MoveFile';
import RenameFile from 'components/file/RenameFile';
import UpdateContentFile from 'components/file/UpdateContentFile';
import DeleteFile from 'components/file/DeleteFile';
import DetailsFile from 'components/file/detailsFile/DetailsFile';
import RestoreFile from "components/file/RestoreFile";

import { IPCFile } from 'types/types';

import { useConfigContext } from 'contexts/config';

const FileOptionsContent = ({ file, files }: { file: IPCFile; files: IPCFile[] }): JSX.Element => (
	<>
		{file.deletedAt ? (
			<RestoreFile file={file} concernedFiles={files} />
		) : (
			<>
				<DownloadFile file={file} />
				<ShareFile file={file} />
				<MoveFile file={file} />
				<RenameFile file={file} concernedFiles={files} />
				<UpdateContentFile file={file} />
			</>
		)}
		<DetailsFile file={file} />
		<DeleteFile file={file} concernedFiles={files} />
	</>
);

const FileOptionsPopover = ({
	file,
	files,
	clickPosition,
	popoverOpeningToggle,
	popoverOpeningHandler
}: {
	file: IPCFile;
	files: IPCFile[];
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
				<Box position="absolute" w="1px" h="1px" bg="transparent" top={clickPosition.y} left={clickPosition.x} />
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
							<FileOptionsContent file={file} files={files} />
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

const FileOptionsDrawer = ({
	file,
	files,
	isOpen,
	onClose,
}: {
	file: IPCFile;
	files: IPCFile[];
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element => (
	<Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
		<DrawerOverlay />
		<DrawerContent borderRadius="16px 16px 0px 0px">
			<DrawerBody px="16px" py="32px">
				<VStack w="100%" spacing="12px">
					<FileOptionsContent file={file} files={files} />
				</VStack>
			</DrawerBody>
		</DrawerContent>
	</Drawer>
);

export { FileOptionsPopover, FileOptionsDrawer };
