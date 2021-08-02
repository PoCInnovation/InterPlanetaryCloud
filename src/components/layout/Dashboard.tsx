import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Sidebar from './Sidebar';

type TDashboardProps = RouteComponentProps;

const Dashboard: React.FC<TDashboardProps> = ({ children }: React.PropsWithChildren<TDashboardProps>) => (
	<div className="grid grid-cols-[300px,1fr] h-screen overflow-hidden">
		<Sidebar />
		<div className="p-12">{children}</div>
	</div>
);

export default withRouter(Dashboard);
