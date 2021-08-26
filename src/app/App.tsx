import { useEffect, useState } from 'react';

import Routes from './Routes';

import User from '../lib/user';
import Auth from '../lib/auth';

import UserContext from '../contexts/user';
import AuthContext from '../contexts/auth';
import FullPageLoader from '../components/loaders/FullPageLoader';

const App = (): JSX.Element => {
	const [auth, setAuth] = useState<Auth | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<null | Error>(null);

	useEffect(() => {
		if (!auth && !error) {
			(async () => {
				try {
					setAuth(new Auth());
				} catch (e) {
					setError(e);
				}
			})();
		}
	});

	// TODO: better error messages
	if (error) return <div>Something bad happened: {error.message}</div>;
	if (!auth) return <FullPageLoader />;

	return (
		<>
			<AuthContext.Provider value={auth}>
				<UserContext.Provider value={{ user: user as User, setUser }}>
					<Routes />
				</UserContext.Provider>
			</AuthContext.Provider>
		</>
	);
};

export default App;
