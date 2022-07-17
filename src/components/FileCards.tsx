import { useState } from 'react';
import {
	Button, Icon, useToast, Text, HStack,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverArrow,
	PopoverHeader,
	PopoverCloseButton,
	PopoverBody,
	PopoverFooter
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { MdPeopleAlt } from 'react-icons/md';

import FileCard from 'components/FileCard';
import FileEditButtons from 'components/FileEditButtons';

import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';
import { FcDownload, FcFile,FcAdvance } from 'react-icons/fc';

type FileCardsProps = {
	files: IPCFile[];
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenShare: () => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
};

const FileCards = ({
	files,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
}: FileCardsProps): JSX.Element => {
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
			{files.map((file: IPCFile) => (
				<FileCard key={file.created_at} file={file}>
					<>
						<HStack>
							<FcFile size="35"></FcFile>
							<Popover placement='right'>
								<PopoverTrigger>
									<Button display="flex" w="600px" backgroundColor={'white'} justifyContent="start">
										{file.name}
									</Button>
								</PopoverTrigger>
								<Portal>
									<PopoverContent w="300px">
										<PopoverHeader>
											<HStack>
												<FcDownload size="30"></FcDownload>
												<Button
													backgroundColor={'white'} justifyContent="flex-start"
													w="100%"
													p="0px"
													mx="4px"
													onClick={async () => downloadFile(file)}
													isLoading={isDownloadLoading}
													id="ipc-dashboard-download-button"
												>Download</Button>
											</HStack>
										</PopoverHeader>
										<PopoverBody>
											<HStack>
												<FcAdvance size="30"></FcAdvance>
												<Button
													backgroundColor={'white'} justifyContent="flex-start"
													w="100%"
													p="0px"
													mx="4px"
													onClick={async () => downloadFile(file)}
													isLoading={isDownloadLoading}
													id="ipc-dashboard-download-button"
												>Move to..</Button>
											</HStack>
										</PopoverBody>
										<PopoverFooter>
											<HStack>
												<FileEditButtons
													file={file}
													isUpdateLoading={isUpdateLoading}
													setSelectedFile={setSelectedFile}
													onOpenUpdateFileName={onOpenUpdateFileName}
													onOpenUpdateFileContent={onOpenUpdateFileContent}
												/>
											</HStack>
										</PopoverFooter>
									</PopoverContent>
								</Portal>
							</Popover>
						</HStack>
						<Text w="10%">
							me
						</Text>
						<Text w="10%">
							{file.created_at}
						</Text>
						<Text w="4%">
							17ko
						</Text>
					</>
				</FileCard>
			))}
		</>
	);
};

export default FileCards;
