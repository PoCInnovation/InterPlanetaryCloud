import React from 'react';
import { IPCContact, IPCFile } from '../types/types';
import { FileCards } from './FileCards';
import { ContactCards } from './ContactCards';

type FileCardsProps = {
	myFiles: IPCFile[];
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
	return (
		<ContactCards
			contacts={contacts}
			setContactInfo={setContactInfo}
			onOpenContactUpdate={onOpenContactUpdate}
			onOpenContactAdd={onOpenContactAdd}
			deleteContact={deleteContact}
		/>
	);
};
