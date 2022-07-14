import DriveCards from 'components/DriveCards';
import ProgramCards from 'components/ProgramCards';
import ContactCards from 'components/ContactCards';
import ProfileCard from 'components/ProfileCard';

import type { IPCContact, IPCFile, IPCProgram } from 'types/types';

type CardsProps = {
	myFiles: IPCFile[];
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
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
	deleteContact: (contactToDelete: IPCContact) => Promise<void>;
};

export const DisplayCards = ({
	myFiles,
	myPrograms,
	sharedFiles,
	contacts,
	index,
	path,
	setPath,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	setContactInfo,
	onOpenContactUpdate,
	onOpenContactAdd,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
	deleteContact,
}: CardsProps): JSX.Element => {
	if (index === 0)
		return (
			<DriveCards
				files={myFiles.filter((file) => file.path === path)}
				path={path}
				setPath={setPath}
				isUpdateLoading={isUpdateLoading}
				setSelectedFile={setSelectedFile}
				onOpenShare={onOpenShare}
				onOpenUpdateFileName={onOpenUpdateFileName}
				onOpenUpdateFileContent={onOpenUpdateFileContent}
			/>
		);
	if (index === 1)
		return (
			<DriveCards
				files={sharedFiles}
				path={path}
				setPath={setPath}
				isUpdateLoading={isUpdateLoading}
				setSelectedFile={setSelectedFile}
				onOpenShare={onOpenShare}
				onOpenUpdateFileName={onOpenUpdateFileName}
				onOpenUpdateFileContent={onOpenUpdateFileContent}
			/>
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
	if (index === 3) return <ProgramCards programs={myPrograms} />;
	return (
		<ProfileCard profile={contacts[0]} setContactInfo={setContactInfo} onOpenContactUpdate={onOpenContactUpdate} />
	);
};
