import { Button, Icon } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { MdPeopleAlt } from 'react-icons/md';
import React from 'react';
import FileCard from './FileCard';
import { FileEditButtons } from './FileEditButtons';
import type { IPCFile } from '../types/types';

type FileCardsProps = {
	files: IPCFile[];
	downloadFile: (file: IPCFile) => Promise<void>;
	isDownloadLoading: boolean;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenShare: () => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
};

export const FileCards = ({
	files,
	downloadFile,
	isDownloadLoading,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
}: FileCardsProps): JSX.Element => (
	<>
		{files.map((file: IPCFile) => (
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
						id="ipc-dashboardView-download-button"
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
						id="ipc-dashboardView-share-button"
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
		))}
	</>
);
