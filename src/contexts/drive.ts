import { createContext, Dispatch, useContext } from 'react';

import type { IPCContact, IPCFile, IPCFolder } from 'types/types';

type DriveContextProps = {
	files: IPCFile[];
	setFiles: Dispatch<IPCFile[] | undefined>;
	folders: IPCFolder[];
	setFolders: Dispatch<IPCFolder[] | undefined>;
	contacts: IPCContact[];
	setContacts: Dispatch<IPCContact[] | undefined>;
};

type DriveContextType = undefined | DriveContextProps;

const DriveContext = createContext<DriveContextType>(undefined);

const useDriveContext = (): DriveContextProps => {
	const context = useContext(DriveContext);
	if (!context) throw new Error('context used outside of provider.');
	return context;
};

export type { DriveContextType };
export { useDriveContext };
export default DriveContext;
