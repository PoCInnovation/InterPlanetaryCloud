import { Button } from '@chakra-ui/react';

type CustomButtonProps = {
	onClick: () => void;
	isLoading: boolean;
};

export const UploadButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button w="100%" backgroundColor={'white'} justifyContent="flex-start" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		Upload a file
	</Button>
);

export const DeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button w="100%" backgroundColor={'white'} justifyContent="flex-start" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		Deploy a program
	</Button>
);

export const CreateFolderButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button w="100%" backgroundColor={'white'} justifyContent="flex-start" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		Create a folder
	</Button>
);

export const NewElemButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button variant="inline" w="80%" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-deploy-button">
		New Elem
	</Button>
);
export const RedeployButton = ({ onClick, isLoading }: CustomButtonProps): JSX.Element => (
	<Button variant="inline" w="45%" size="sm" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-redeploy-button">
		Redeploy
	</Button>
);
