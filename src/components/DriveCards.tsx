import {
	Button,
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
	useColorModeValue,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import FileCard from 'components/FileCard';
import FolderCard from 'components/FolderCard';

import DeleteFile from 'components/file/DeleteFile';
import DownloadFile from 'components/file/DownloadFile';
import MoveFile from 'components/file/MoveFile';
import RenameFile from 'components/file/RenameFile';
import ShareFile from 'components/file/ShareFile';
import UpdateContentFile from 'components/file/UpdateContentFile';

import DeleteFolder from 'components/folder/DeleteFolder';
import MoveFolder from 'components/folder/MoveFolder';

import type { IPCFile, IPCFolder } from 'types/types';

import { FcFile, FcFolder } from 'react-icons/fc';
import { useDriveContext } from 'contexts/drive';
import { useConfigContext } from 'contexts/config';

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
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	return (
		<>
			<PathCard />
			{folders.map((folder) => (
				<FolderCard key={folder.createdAt}>
					<>
						<HStack w="100%">
							<FcFolder display="flex" size="30"></FcFolder>
							<Button
								display="flex"
								w="70%"
								backgroundColor={config?.theme ?? 'white'}
								textColor={colorText}
								className="ipc-folder-popover-button"
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
										backgroundColor={config?.theme ?? 'white'}
										textColor={colorText}
										className="ipc-folder-popover-button"
										justifyContent="start"
									>
										...
									</Button>
								</Box>
							</PopoverTrigger>
							<Portal>
								<PopoverContent w="300px">
									<PopoverBody>
										<MoveFolder folder={folder} />
									</PopoverBody>
									<PopoverFooter>
										<DeleteFolder folder={folder} />
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
										backgroundColor={config?.theme ?? 'white'}
										className="ipc-file-popover-button"
										justifyContent="start"
										textColor={colorText}
									>
										{file.name}
									</Button>
								</PopoverTrigger>
								<Portal>
									<PopoverContent w="300px" backgroundColor={config?.theme ?? 'white'}>
										<PopoverHeader>
											<DownloadFile file={file} />
										</PopoverHeader>
										<PopoverHeader>
											<ShareFile file={file} />
										</PopoverHeader>
										<PopoverBody>
											<MoveFile file={file} />
										</PopoverBody>
										<PopoverBody>
											<RenameFile file={file} />
										</PopoverBody>
										<PopoverFooter>
											<UpdateContentFile file={file} />
										</PopoverFooter>
										<PopoverFooter>
											<DeleteFile file={file} />
										</PopoverFooter>
									</PopoverContent>
								</Portal>
							</Popover>
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
