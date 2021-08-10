import { Route, Switch } from 'react-router-dom';

import HomeView from 'views/home/HomeView';
import LoginView from 'views/login/LoginView';
import SignupView from 'views/signup/SignupView';
import DashboardView from 'views/dashboard/DashboardView';

import User from '../lib/user';

type RoutesPropsType = {
	user: User | null;
};

const Routes = ({ user }: RoutesPropsType): JSX.Element => (
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
);

export default Routes;
