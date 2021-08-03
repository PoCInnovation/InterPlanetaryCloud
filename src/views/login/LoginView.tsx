/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { AuthError } from '../../lib/auth';
import { useAuthContext } from '../../contexts/auth';

const LoginView: React.FC = () => {
	const auth = useAuthContext();

	useEffect(() => {
		(async () => {
			auth.login().catch((error: AuthError) => console.error(error));
		})();
	}, []);

	// TODO: ajouter boutton Metamask - boutton Installer Metamask
	return <></>;
};

export default LoginView;
