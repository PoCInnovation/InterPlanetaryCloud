import { BrowserRouter, Redirect, Switch } from 'react-router-dom';

import HomeView from 'views/HomeView';
import LoginView from 'views/LoginView';
import SignupView from 'views/SignupView';
import DashboardView from 'views/DashboardView';

import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';
import ComputingView from 'views/ComputingView';

const Routes = (): JSX.Element => (
	<BrowserRouter>
		<Switch>
			<PrivateRoute path="/dashboard" children={<DashboardView />} />
			<PrivateRoute path="/computing" children={<ComputingView />} />
			<AuthRoute exact path="/" children={<HomeView />} />
			<AuthRoute path="/signup" children={<SignupView />} />
			<AuthRoute path="/login" children={<LoginView />} />
			<Redirect push to="/" />
		</Switch>
	</BrowserRouter>
);

export default Routes;
