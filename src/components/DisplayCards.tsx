import DriveCards from 'components/DriveCards';
import ProgramCards from 'components/ProgramCards';
import ContactCards from 'components/ContactCards';
import ProfileCard from 'components/ProfileCard';

import type { IPCContact, IPCFile, IPCFolder, IPCProgram } from 'types/types';

import { VStack, HStack, Box, Text, Spacer } from '@chakra-ui/react';

type CardsProps = {
	myFiles: IPCFile[];
	myFolders: IPCFolder[];
	myPrograms: IPCProgram[];
	sharedFiles: IPCFile[];
	contacts: IPCContact[];
	index: number;
	path: string;
	setPath: (path: string) => void;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenShare: () => void;
	setContactInfo: (contact: IPCContact) => void;
	onOpenContactUpdate: () => void;
	onOpenContactAdd: () => void;
	onOpenMoveFile: () => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
	deleteContact: (contactToDelete: IPCContact) => Promise<void>;
	onOpenRedeployProgram: () => void;
	isRedeployLoading: boolean;
	setSelectedProgram: (program: IPCProgram) => void;
};

export const DisplayCards = ({
	myFiles,
	myFolders,
	myPrograms,
	sharedFiles,
	contacts,
	index,
	path,
	setPath,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	onOpenMoveFile,
	setContactInfo,
	onOpenContactUpdate,
	onOpenContactAdd,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
	deleteContact,
	onOpenRedeployProgram,
	isRedeployLoading,
	setSelectedProgram,
}: CardsProps): JSX.Element => {
	if (index === 0)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35">My Files</Text>
				</Box>
				<HStack w="100%">
					<Box>
						<Text marginLeft="10">Name</Text>
					</Box>
					<Spacer />
					<Box>
						<Text align="center">Latest upload on Aleph</Text>
					</Box>
					<Spacer />
					<Box>
						<Text align="center">File Size</Text>
					</Box>
				</HStack>
				<DriveCards
					files={myFiles.filter((elem) => elem.path === path)}
					folders={myFolders.filter((elem) => elem.path === path)}
					path={path}
					setPath={setPath}
					isUpdateLoading={isUpdateLoading}
					setSelectedFile={setSelectedFile}
					onOpenShare={onOpenShare}
					onOpenMoveFile={onOpenMoveFile}
					onOpenUpdateFileName={onOpenUpdateFileName}
					onOpenUpdateFileContent={onOpenUpdateFileContent}
				/>
			</VStack>
		);
	if (index === 1)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35">Shared with me</Text>
				</Box>
				<DriveCards
					files={sharedFiles}
					folders={[]}
					path={path}
					setPath={setPath}
					isUpdateLoading={isUpdateLoading}
					setSelectedFile={setSelectedFile}
					onOpenShare={onOpenShare}
					onOpenMoveFile={onOpenMoveFile}
					onOpenUpdateFileName={onOpenUpdateFileName}
					onOpenUpdateFileContent={onOpenUpdateFileContent}
				/>
			</VStack>
		);
	if (index === 2)
		return (
			<ContactCards
				contacts={contacts}
				setContactInfo={setContactInfo}
				onOpenContactUpdate={onOpenContactUpdate}
				onOpenContactAdd={onOpenContactAdd}
				deleteContact={deleteContact}
			/>
		);
	if (index === 3)
		return (
			<ProgramCards
				programs={myPrograms}
				onOpenRedeployProgram={onOpenRedeployProgram}
				isRedeployLoading={isRedeployLoading}
				setSelectedProgram={setSelectedProgram}
			/>
		);
	return (
		<ProfileCard profile={contacts[0]} setContactInfo={setContactInfo} onOpenContactUpdate={onOpenContactUpdate} />
	);
};
