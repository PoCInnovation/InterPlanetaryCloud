import { useState } from 'react';
import { Button, Icon, useToast } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { MdPeopleAlt } from 'react-icons/md';

import FileCard from 'components/FileCard';
import FolderCard from 'components/FolderCard';
import FileEditButtons from 'components/FileEditButtons';

import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';

type DriveCardsProps = {
	files: IPCFile[];
	path: string;
	setPath: (path: string) => void;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenShare: () => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
};

const DriveCards = ({
	files,
	path,
	setPath,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
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
			{files.map((file: IPCFile) => {
				if (file.isFile) {
					return (
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
								<FileEditButtons
									file={file}
									isUpdateLoading={isUpdateLoading}
									setSelectedFile={setSelectedFile}
									onOpenUpdateFileName={onOpenUpdateFileName}
									onOpenUpdateFileContent={onOpenUpdateFileContent}
								/>
							</>
						</FileCard>
					);
				}
				return <FolderCard key={file.created_at} name={file.name} path={path} setPath={setPath} />;
			})}
		</>
	);
};

export default DriveCards;
