import { useEffect, useState } from 'react';

import Routes from './Routes';

import User from '../lib/user';
import Auth from '../lib/auth';

import UserContext from '../contexts/user';
import AuthContext from '../contexts/auth';
import FullPageLoader from '../components/loaders/FullPageLoader';

const App = (): JSX.Element => {
	// QUESTION: À t'on vraiment besoin de ça ? (écho au contexte provider)
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
			{/* QUESTION: C'est pour quoi le AuthContext provider ? À quoi sert le param auth ?
									Faut-il passer le auth au travers de tous les children ? */}
			<AuthContext.Provider value={auth}>
				{/* QUESTION: C'est pour quoi le UserContext.Provider ? À quoi servent les params user et setUser ?
											Faut-il passer le setUser au travers de tous les children ? */}
				<UserContext.Provider value={{ user: user as User, setUser }}>
					<Routes />
				</UserContext.Provider>
			</AuthContext.Provider>
		</>
	);
};

export default App;
