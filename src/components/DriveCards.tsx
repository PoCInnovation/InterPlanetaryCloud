import { useState } from 'react';
import {
	Button,
	useToast,
	Text,
	HStack,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	Box,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import FileCard from 'components/FileCard';
import FolderCard from 'components/FolderCard';
import { FileRenameButton, FileContentButton, FileDeleteButton } from 'components/FileEditButtons';
import MoveFileButton from 'components/MoveFileButton';

import type { IPCFile, IPCFolder } from 'types/types';

import { useUserContext } from 'contexts/user';
import { FcDownload, FcFile, FcAdvance, FcFolder, FcUpload, FcEditImage, FcFullTrash } from 'react-icons/fc';

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
	onOpenDeleteFile: () => void;
};

type PathCardProps = {
	path: string;
	setPath: (path: string) => void;
};

const PathCard = ({ path, setPath }: PathCardProps): JSX.Element => {
	if (path === '/') return <></>;

	return (
		<HStack w="100%">
			<Button
				backgroundColor={'white'}
				size="sm"
				w="10%"
				p="0px"
				mx="4px"
				boxShadow="1px 2px 3px 3px rgb(240, 240, 240)"
				onClick={() => setPath(path.replace(/([^/]+)\/$/, ''))}
				id="ipc-dashboard-back-path-button"
			>
				<ArrowBackIcon fontSize="30" />
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
	onOpenMoveFile,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
	onOpenDeleteFile,
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
				<FolderCard key={folder.createdAt}>
					<>
						<HStack w="100%">
							<FcFolder display="flex" size="30"></FcFolder>
							<Button
								display="flex"
								w="70%"
								backgroundColor={'white'}
								className="ipc-file-popover-button"
								justifyContent="start"
								onClick={() => setPath(`${path}${folder.name}/`)}
							>
								{folder.name}
							</Button>
						</HStack>
						<Popover placement="left">
							<PopoverTrigger>
								<Box>
									<Button
										display="flex"
										w="5%"
										backgroundColor={'white'}
										className="ipc-file-popover-button"
										justifyContent="start"
									>
										...
									</Button>
								</Box>
							</PopoverTrigger>
							<Portal>
								<PopoverContent w="300px">
									<PopoverBody>
										<HStack>
											<FcAdvance size="30"></FcAdvance>
											<Text>move to ...</Text>
										</HStack>
									</PopoverBody>
									<PopoverFooter>
										<HStack>
											<FcFullTrash size="30"></FcFullTrash>
											<Text>Delete Folder</Text>
										</HStack>
									</PopoverFooter>
								</PopoverContent>
							</Portal>
						</Popover>
					</>
				</FolderCard>
			))}
			{files.map((file) => (
				<FileCard key={file.createdAt}>
					<>
						<HStack>
							<FcFile size="35"></FcFile>
							<Popover placement="right">
								<PopoverTrigger>
									<Button
										display="flex"
										w="100%"
										backgroundColor={'white'}
										className="ipc-file-popover-button"
										justifyContent="start"
									>
										{file.name}
									</Button>
								</PopoverTrigger>
								<Portal>
									<PopoverContent w="300px">
										<PopoverHeader>
											<HStack>
												<FcDownload size="30"></FcDownload>
												<Button
													backgroundColor={'white'}
													justifyContent="flex-start"
													w="100%"
													p="0px"
													mx="4px"
													onClick={async () => downloadFile(file)}
													isLoading={isDownloadLoading}
													id="ipc-dashboard-download-button"
												>
													Download
												</Button>
											</HStack>
										</PopoverHeader>
										<PopoverBody>
											<HStack>
												<FcAdvance size="30"></FcAdvance>
												<MoveFileButton
													file={file}
													isUpdateLoading={isUpdateLoading}
													setSelectedFile={setSelectedFile}
													onOpenMoveFile={onOpenMoveFile}
												/>
											</HStack>
										</PopoverBody>
										<PopoverFooter>
											<HStack>
												<FcEditImage size="30"></FcEditImage>
												<FileRenameButton
													file={file}
													isUpdateLoading={isUpdateLoading}
													setSelectedFile={setSelectedFile}
													onOpenUpdateFileName={onOpenUpdateFileName}
												/>
											</HStack>
										</PopoverFooter>
										<PopoverFooter>
											<HStack>
												<FcUpload size="30"></FcUpload>
												<FileContentButton
													file={file}
													isUpdateLoading={isUpdateLoading}
													setSelectedFile={setSelectedFile}
													onOpenUpdateFileContent={onOpenUpdateFileContent}
												/>
											</HStack>
										</PopoverFooter>
										<PopoverFooter>
											<HStack>
												<FcFullTrash size="30"></FcFullTrash>
												<FileDeleteButton
													file={file}
													setSelectedFile={setSelectedFile}
													onOpenDeleteFile={onOpenDeleteFile}
												/>
											</HStack>
										</PopoverFooter>
									</PopoverContent>
								</Portal>
							</Popover>
						</HStack>
						<Box w="33%">
							<Text>
								{`${new Date(file.createdAt).toString().substring(4, 15).slice(0, 3)} /${new Date(file.createdAt)
									.toString()
									.substring(4, 15)
									.slice(3, 6)} /${new Date(file.createdAt).toString().substring(4, 15).slice(6)}`}
							</Text>
						</Box>
						<Box>
							<Text>{file.size / 1000} ko</Text>
						</Box>
					</>
				</FileCard>
			))}
		</>
	);
};

export default DriveCards;
