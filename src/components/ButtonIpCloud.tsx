import { Link as RouteLink } from 'react-router-dom';

import { Button, Link } from '@chakra-ui/react';

const ButtonIpCloud = (): JSX.Element => (
	<>
		<Link as={RouteLink} to="/dashboard" w="100%" id="ipc-homeView-login-button">
			<Button variant="inline" w="100%" mb="16px" id="ipc-dashboardView-upload-file-modal-button">
				Inter Planetary Cloud
			</Button>
		</Link>
	</>
);

export default ButtonIpCloud;
