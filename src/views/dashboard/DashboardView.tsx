import React from 'react';

import Dashboard from 'components/layout/Dashboard';
import UploadFileFloatingButton from 'components/buttons/UploadFileFloatingButton';
import FilesGrid from './FilesGrid';

const DashboardPage: React.FC = () => (
	<Dashboard>
		<FilesGrid />
		<UploadFileFloatingButton />
	</Dashboard>
);

export default DashboardPage;
