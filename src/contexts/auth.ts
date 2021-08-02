import React from 'react';

import Auth from '../lib/auth';

type TAuthContext = null | Auth;

const AuthContext = React.createContext<TAuthContext>(null);

const useAuthContext = (): Auth => {
	const context = React.useContext(AuthContext);
	if (context === null) {
		throw new Error('context used outside of provider.');
	}
	return context;
};

export type { TAuthContext };
export { useAuthContext };
export default AuthContext;
