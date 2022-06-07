import { Button, Icon } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { MdPeopleAlt } from 'react-icons/md';
import React from 'react';
import FileCard from './FileCard';
import { IPCFile, IPCProgram } from '../types/types';

type FileCardsProps = {
	files: IPCFile[];
	programs: IPCProgram[];
	downloadFile: (file: IPCFile) => Promise<void>;
	isDownloadLoading: boolean;
	setSelectedFile: React.Dispatch<React.SetStateAction<IPCFile>>;
	onOpenShare: () => void;
};

export const FileCards = ({
	files,
	programs,
	downloadFile,
	isDownloadLoading,
	setSelectedFile,
	onOpenShare,
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
						onClick={async () => downloadFile(file as IPCFile)}
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
							setSelectedFile(file as IPCFile);
							onOpenShare();
						}}
						isLoading={isDownloadLoading}
						id="ipc-dashboardView-share-button"
					>
						<Icon as={MdPeopleAlt} />
					</Button>
				</>
			</FileCard>
		))}
		{programs.map((program: IPCProgram) => (
			<FileCard key={program.created_at} file={program}>
				<>
					<Button
						as="a"
						href={`https://aleph.sh/vm/${program.hash}`}
						target="_blank"
						variant="inline"
						size="sm"
						w="100%"
						p="0px"
						id="ipc-computingView-forwardUrl-button"
					>
						Go to site
					</Button>
				</>
			</FileCard>
		))}
	</>
);
