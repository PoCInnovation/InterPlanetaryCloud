import React from 'react';
import { IPCContact, IPCProgram } from 'types/types';
import { ProfileCard } from './ProfileCard';
import { ProgramCards } from './ProgramCards';

type ProgramCardsProps = {
	myPrograms: IPCProgram[];
	contacts: IPCContact[];
	index: number;
	setContactInfo: React.Dispatch<React.SetStateAction<IPCContact>>;
	onOpenContactUpdate: () => void;
};

export const DisplayProgramCards = ({
	myPrograms,
	contacts,
	index,
	setContactInfo,
	onOpenContactUpdate,
}: ProgramCardsProps): JSX.Element => {
	if (index === 0) return <ProgramCards programs={myPrograms} />;
	return (
		<ProfileCard profile={contacts[0]} setContactInfo={setContactInfo} onOpenContactUpdate={onOpenContactUpdate} />
	);
};
