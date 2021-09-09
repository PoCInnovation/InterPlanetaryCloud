import { Box, Flex, Text } from '@chakra-ui/react';

import { IPCFile } from 'lib/user';

type FileCardProps = {
	file: IPCFile;
	children: JSX.Element;
};

const FileCard = ({ file, children }: FileCardProps): JSX.Element => (
	<Box
		p="16px"
		bg="white"
		w="100%"
		boxShadow="0px 2px 3px 3px rgb(240, 240, 240)"
		borderRadius="4px"
		border="1px solid rgb(200, 200, 200)"
		mb="8px"
		display="flex"
		justifyContent="space-between"
	>
		<Flex w="100%" justify="space-between" align="center">
			<Text fontWeight="500">{file.name}</Text>
			{children}
		</Flex>
	</Box>
);

export default FileCard;
