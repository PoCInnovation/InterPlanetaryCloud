import React from 'react';
import { IPCContact, IPCFile, IPCProgram } from '../types/types';
import { FileCards } from './FileCards';
import { ProgramCards } from './ProgramCards';
import { ContactCards } from './ContactCards';
import { ProfileCard } from './ProfileCard';

type FileCardsProps = {
	myFiles: IPCFile[];
	myPrograms: IPCProgram[];
	sharedFiles: IPCFile[];
	contacts: IPCContact[];
	index: number;
	downloadFile: (file: IPCFile) => Promise<void>;
	isDownloadLoading: boolean;
	setSelectedFile: React.Dispatch<React.SetStateAction<IPCFile>>;
	onOpenShare: () => void;
	setContactInfo: React.Dispatch<React.SetStateAction<IPCContact>>;
	onOpenContactUpdate: () => void;
	onOpenContactAdd: () => void;
	deleteContact: (contactToDelete: IPCContact) => Promise<void>;
};

export const DisplayFileCards = ({
	myFiles,
	myPrograms,
	sharedFiles,
	contacts,
	index,
	downloadFile,
	isDownloadLoading,
	setSelectedFile,
	onOpenShare,
	setContactInfo,
	onOpenContactUpdate,
	onOpenContactAdd,
	deleteContact,
}: FileCardsProps): JSX.Element => {
	if (index === 0)
		return (
			<FileCards
				files={myFiles}
				downloadFile={downloadFile}
				isDownloadLoading={isDownloadLoading}
				setSelectedFile={setSelectedFile}
				onOpenShare={onOpenShare}
			/>
		);
	if (index === 1)
		return (
			<FileCards
				files={sharedFiles}
				downloadFile={downloadFile}
				isDownloadLoading={isDownloadLoading}
				setSelectedFile={setSelectedFile}
				onOpenShare={onOpenShare}
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
