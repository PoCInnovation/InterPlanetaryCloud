import { Box, Flex, Text, HStack, Button } from '@chakra-ui/react';
import { FcFile } from 'react-icons/fc';

import type { IPCFile } from 'types/types';

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
		border="0px solid rgb(200, 200, 200)"
		mb="8px"
		display="flex"
		justifyContent="space-between"
	>
		<HStack w="100%">
			<Flex w="100%" justify="space-between" align="center">
				{children}
			</Flex>
		</HStack>
	</Box>
);

export default FileCard;
