import { createContext, useContext } from 'react';

import Auth from 'lib/auth';

type AuthContextType = Auth | undefined;

const AuthContext = createContext<AuthContextType>(undefined);

const useAuthContext = (): Auth => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('context used outside of provider.');
	return context;
};

export type { AuthContextType };
export { useAuthContext };
export default AuthContext;
