import { Button } from '@chakra-ui/react';

type UploadButtonProps = {
	text: string;
	onClick: () => void;
	isLoading: boolean;
};

export const UploadButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button variant="inline" w="80%" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		{text}
	</Button>
);

export const ContactButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button variant="inline" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-contact-button">
		{text}
	</Button>
);

export const DeployButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button variant="inline" w="80%" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-deploy-button">
		{text}
	</Button>
);

export const RedeployButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button
		variant="inline"
		w="45%"
		size="sm"
		borderRadius="lg"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-redeploy-button"
	>
		{text}
	</Button>
);

export const GithubDeployButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button
		variant="inline"
		w="80%"
		borderRadius="lg"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-github-deploy-button"
	>
		{text}
	</Button>
);
