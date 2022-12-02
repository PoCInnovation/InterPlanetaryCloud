import { Button, useColorModeValue } from '@chakra-ui/react';
import { useConfigContext } from 'contexts/config';

type CustomButtonProps = {
	onClick: () => void;
	isLoading: boolean;
};

const ContextColor = () => {
	const { config } = useConfigContext();
	return config?.theme ?? 'white';
};

const ChoseColor = () => {
	const colorText = useColorModeValue('gray.800', 'white');
	return colorText;
};

export const DeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button
		w="100%"
		backgroundColor={ContextColor()}
		textColor={ChoseColor()}
		justifyContent="flex-start"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-deploy-button"
	>
		Deploy a program
	</Button>
);

export const RedeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button
		variant="inline"
		w="45%"
		size="sm"
		borderRadius="lg"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-redeploy-button"
	>
		Redeploy
	</Button>
);

export const GithubDeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button
		w="100%"
		backgroundColor={ContextColor()}
		textColor={ChoseColor()}
		justifyContent="flex-start"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-github-deploy-button"
	>
		Deploy from Github
	</Button>
);
