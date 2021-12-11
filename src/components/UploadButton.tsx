import { Button } from '@chakra-ui/react';

type UploadButtonProps = {
	text: string;
	onClick: () => void;
	isLoading: boolean;
};

const UploadButton = ({ text, onClick, isLoading }: UploadButtonProps): JSX.Element => (
	<Button variant="inline" borderRadius="lg" onClick={onClick} isLoading={isLoading} id="ipc-upload-button">
		{text}
	</Button>
);

export default UploadButton;
