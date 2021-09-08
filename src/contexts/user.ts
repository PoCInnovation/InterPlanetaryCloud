import { createContext, Dispatch, useContext } from 'react';

import User from 'lib/user';

type UserContextType = undefined | { user: User; setUser: Dispatch<User | undefined> };

const UserContext = createContext<UserContextType>(undefined);

const useUserContext = (): { user: User; setUser: Dispatch<User | undefined> } => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('context used outside of provider.');
	}
	return context;
};

export type { UserContextType };
export { useUserContext };
export default UserContext;
