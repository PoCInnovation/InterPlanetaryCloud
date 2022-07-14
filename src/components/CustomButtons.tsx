import { Button } from '@chakra-ui/react';

type CustomButtonProps = {
	onClick: () => void;
	isLoading: boolean;
};

export const UploadButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button variant="inline" w="80%" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		Upload a file
	</Button>
);

export const DeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button variant="inline" w="80%" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-deploy-button">
		Deploy a program
	</Button>
);

export const CreateFolderButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button
		variant="inline"
		w="80%"
		borderRadius="lg"
		onClick={onClick}
		isLoading={isLoading}
		id="ipc-create-folder-button"
	>
		Create a folder
	</Button>
);
