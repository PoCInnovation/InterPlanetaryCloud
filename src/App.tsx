// @ts-ignore
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomeView from 'views/home/HomeView';
import LoginView from 'views/login/LoginView';
import SignupView from 'views/signup/SignupView';
import DashboardView from 'views/dashboard/DashboardView';

import User from './lib/user';
import Auth from './lib/auth';

import UserContext from './contexts/user';
import AuthContext from './contexts/auth';
import FullPageLoader from './components/loaders/FullPageLoader';

const App: React.FC = () => {
	const [auth, setAuth] = React.useState<Auth | null>(null);
	const [user, setUser] = React.useState<User | null>(null);
	const [error, setError] = React.useState<null | Error>(null);

	React.useEffect(() => {
		if (!auth && !error) {
			(async () => {
				try {
					// const db = new Database();
					// await db.init();
					// setDatabase(db);
					setAuth(new Auth());
				} catch (e) {
					setError(e);
				}
			})();
		}
	});

	if (error) {
		return <div>Something bad happened: {error.message}</div>;
	}

	if (!auth) {
		return <FullPageLoader />;
	}

	return (
		<>
			<AuthContext.Provider value={auth}>
				<UserContext.Provider value={{ user: user as User, setUser }}>
					<Switch>
						<Route exact path="/">
							<HomeView />
						</Route>
						<Route path="/signup">
							<SignupView />
						</Route>
						<Route path="/login">
							<LoginView />
						</Route>
						{user && (
							<Route path="/dashboard">
								<DashboardView />
							</Route>
						)}
					</Switch>
				</UserContext.Provider>
			</AuthContext.Provider>
		</>
	);
};

export default App;
