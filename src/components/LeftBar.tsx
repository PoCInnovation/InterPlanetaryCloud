import { Text, VStack } from '@chakra-ui/react';

type LeftBarPropsType = {
	username: string;
	favoriteFiles: string[];
	uploadButton: JSX.Element;
};

const LeftBar = ({ username, favoriteFiles, uploadButton }: LeftBarPropsType): JSX.Element => (
	<VStack>
		{username}
		{favoriteFiles.map((file) => (
			<Text>{file}</Text>
		))}
		{uploadButton}
	</VStack>
);

export default LeftBar;
