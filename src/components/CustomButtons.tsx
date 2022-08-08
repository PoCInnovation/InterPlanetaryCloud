import { Button } from '@chakra-ui/react';

type CustomButtonProps = {
	onClick: () => void;
	isLoading: boolean;
};

export const DeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button
		w="100%"
		backgroundColor={'white'}
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
		backgroundColor={'white'}
		justifyContent="flex-start"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-deploy-button"
	>
		Deploy from Github
	</Button>
);
