import { Link as RouteLink } from 'react-router-dom';

import { Button, Link } from '@chakra-ui/react';

const ButtonIpComputing = (): JSX.Element => {

    return (
        <>
            <Link as={RouteLink} to="/computing" w="100%" id="ipc-homeView-login-button">
                <Button
                    variant="inline"
                    w="100%"
                    mb="16px"
                    id="ipc-dashboardView-upload-file-modal-button"
                >
                    Inter Planetary Computing
                </Button>
            </Link>
        </>
    )
}

export default ButtonIpComputing;