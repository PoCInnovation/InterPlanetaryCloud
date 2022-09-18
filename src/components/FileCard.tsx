import { Box, Flex, HStack } from '@chakra-ui/react';
import { useConfigContext } from 'contexts/config';

type FileCardProps = {
	children: JSX.Element;
};

const ShadowColor = () => {
	const { config } = useConfigContext();
	if (config?.theme === 'gray.800') return '0px 2px 3px 3px rgb(66, 66, 66)';
	return '0px 2px 3px 3px rgb(240, 240, 240)';
};

const ContextColor = () => {
	const { config } = useConfigContext();
	return config?.theme ?? 'white';
};

const FileCard = ({ children }: FileCardProps): JSX.Element => (
	<Box
		p="16px"
		bg={ContextColor()}
		w="100%"
		boxShadow={ShadowColor()}
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
