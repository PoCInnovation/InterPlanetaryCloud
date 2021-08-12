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
		<Route exact path="/" component={HomeView} />
		<Route path="/signup" component={SignupView} />
		<Route path="/login" component={LoginView} />
		{user && <Route path="/dashboard" component={DashboardView} />}
	</Switch>
);

export default Routes;
