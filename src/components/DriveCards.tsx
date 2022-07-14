import { useState } from 'react';
import { Button, Icon, useToast, HStack, Text } from '@chakra-ui/react';
import { DownloadIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { MdPeopleAlt } from 'react-icons/md';

import FileCard from 'components/FileCard';
import FolderCard from 'components/FolderCard';
import FileEditButtons from 'components/FileEditButtons';
import MoveFileButton from 'components/MoveFileButton';

import type { IPCFile, IPCFolder } from 'types/types';

import { useUserContext } from 'contexts/user';

type DriveCardsProps = {
	files: IPCFile[];
	folders: IPCFolder[];
	path: string;
	setPath: (path: string) => void;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenShare: () => void;
	onOpenMoveFile: () => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
};

type PathCardProps = {
	path: string;
	setPath: (path: string) => void;
};

const PathCard = ({ path, setPath }: PathCardProps): JSX.Element => {
	if (path === '/') return <></>;

	return (
		<HStack w="100%" align="center">
			<Button
				variant="inline"
				size="sm"
				w="25%"
				p="0px"
				mx="4px"
				onClick={() => setPath(path.replace(/([^/]+)\/$/, ''))}
				id="ipc-dashboard-back-path-button"
			>
				<ArrowBackIcon />
			</Button>
			<Text fontWeight="500" isTruncated>
				{path}
			</Text>
		</HStack>
	);
};

const DriveCards = ({
	files,
	folders,
	path,
	setPath,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	onOpenMoveFile,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
}: DriveCardsProps): JSX.Element => {
	const { user } = useUserContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);

	const downloadFile = async (file: IPCFile) => {
		setIsDownloadLoading(true);
		try {
			const download = await user.drive.download(file);
			toast({ title: download.message, status: download.success ? 'success' : 'error' });
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to download file', status: 'error' });
		}
		setIsDownloadLoading(false);
	};

	return (
		<>
			<PathCard path={path} setPath={setPath} />
			{folders.map((folder) => (
				<FolderCard key={folder.created_at} name={folder.name} path={path} setPath={setPath} />
			))}
			{files.map((file) => (
				<FileCard key={file.created_at} file={file}>
					<>
						<Button
							variant="inline"
							size="sm"
							w="100%"
							p="0px"
							mx="4px"
							onClick={async () => downloadFile(file)}
							isLoading={isDownloadLoading}
							id="ipc-dashboard-download-button"
						>
							<DownloadIcon />
						</Button>
						<Button
							variant="reverseInline"
							size="sm"
							w="100%"
							p="0px"
							mx="4px"
							onClick={() => {
								setSelectedFile(file);
								onOpenShare();
							}}
							isLoading={isDownloadLoading}
							id="ipc-dashboard-share-button"
						>
							<Icon as={MdPeopleAlt} />
						</Button>
						<MoveFileButton
							file={file}
							isUpdateLoading={isUpdateLoading}
							setSelectedFile={setSelectedFile}
							onOpenMoveFile={onOpenMoveFile}
						/>
						<FileEditButtons
							file={file}
							isUpdateLoading={isUpdateLoading}
							setSelectedFile={setSelectedFile}
							onOpenUpdateFileName={onOpenUpdateFileName}
							onOpenUpdateFileContent={onOpenUpdateFileContent}
						/>
					</>
				</FileCard>
			))}
		</>
	);
};

export default DriveCards;
