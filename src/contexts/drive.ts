import { createContext, Dispatch, useContext } from 'react';

import type { IPCContact, IPCFile, IPCFolder, IPCProgram } from 'types/types';

// TODO: use templating
type DriveContextProps = {
	files: IPCFile[];
	setFiles: Dispatch<IPCFile[]>;
	sharedFiles: IPCFile[];
	setSharedFiles: Dispatch<IPCFile[]>;
	folders: IPCFolder[];
	setFolders: Dispatch<IPCFolder[]>;
	programs: IPCProgram[];
	setPrograms: Dispatch<IPCProgram[]>;
	contacts: IPCContact[];
	setContacts: Dispatch<IPCContact[]>;
	path: string;
	setPath: Dispatch<string>;
};

type DriveContextType = DriveContextProps | undefined;

const DriveContext = createContext<DriveContextType>(undefined);

const useDriveContext = (): DriveContextProps => {
	const context = useContext(DriveContext);
	if (!context) throw new Error('context used outside of provider.');
	return context;
};

export type { DriveContextType };
export { useDriveContext };
export default DriveContext;
