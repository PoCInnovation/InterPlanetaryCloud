import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import HomeView from 'views/HomeView';
import LoginView from 'views/LoginView';
import SignupView from 'views/SignupView';
import DashboardView from 'views/DashboardView';
import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';

// TODO: if User redirect to dashboard
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
