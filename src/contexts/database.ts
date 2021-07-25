import React from 'react';

import { Database } from '../lib/database';

export type TDatabaseContext = null | Database;

const DatabaseContext = React.createContext<TDatabaseContext>(null);

const useDatabaseContext = (): Database => {
	const context = React.useContext(DatabaseContext);
	if (context === null) {
		throw new Error('context used outside of provider.');
	}
	return context;
};

export { useDatabaseContext };
export default DatabaseContext;
