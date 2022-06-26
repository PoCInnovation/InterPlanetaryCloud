import type { IPCContact, IPCFile, IPCProgram } from 'types/types';
import { FileCards } from 'components/FileCards';
import { ProgramCards } from 'components/ProgramCards';
import { ContactCards } from 'components/ContactCards';
import { ProfileCard } from 'components/ProfileCard';

type FileCardsProps = {
	myFiles: IPCFile[];
	myPrograms: IPCProgram[];
	sharedFiles: IPCFile[];
	contacts: IPCContact[];
	index: number;
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

export const DisplayFileCards = ({
	myFiles,
	myPrograms,
	sharedFiles,
	contacts,
	index,
	isUpdateLoading,
	setSelectedFile,
	onOpenShare,
	setContactInfo,
	onOpenContactUpdate,
	onOpenContactAdd,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
	deleteContact,
}: FileCardsProps): JSX.Element => {
	if (index === 0)
		return (
			<FileCards
				files={myFiles}
				isUpdateLoading={isUpdateLoading}
				setSelectedFile={setSelectedFile}
				onOpenShare={onOpenShare}
				onOpenUpdateFileName={onOpenUpdateFileName}
				onOpenUpdateFileContent={onOpenUpdateFileContent}
			/>
		);
	if (index === 1)
		return (
			<FileCards
				files={sharedFiles}
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
