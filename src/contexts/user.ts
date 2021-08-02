import React from 'react';

import User from 'lib/user';

type TUserContext = null | { user: User; setUser: React.Dispatch<User | null> };

const UserContext = React.createContext<TUserContext>(null);

const useUserContext = (): { user: User; setUser: React.Dispatch<User | null> } => {
	const context = React.useContext(UserContext);
	if (context === null) {
		throw new Error('context used outside of provider.');
	}
	return context;
};

export type { TUserContext };
export { useUserContext };
export default UserContext;
