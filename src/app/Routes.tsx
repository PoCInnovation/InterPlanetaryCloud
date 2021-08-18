import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import HomeView from 'views/home/HomeView';
import LoginView from 'views/login/LoginView';
import SignupView from 'views/signup/SignupView';
import DashboardView from 'views/dashboard/DashboardView';
import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';

const Routes = (): JSX.Element => (
	<Router>
		<Switch>
			<AuthRoute exact path="/" children={<HomeView />} />
			<AuthRoute path="/signup" children={<SignupView />} />
			<AuthRoute path="/login" children={<LoginView />} />
			<PrivateRoute path="/dashboard" children={<DashboardView />} />
			<Redirect push to="/" />
		</Switch>
	</Router>
);
export default Routes;
