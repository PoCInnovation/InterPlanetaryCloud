import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';

type FolderCardProps = {
	name: string;
	path: string;
	setPath: (path: string) => void;
	children: JSX.Element;
};

const FolderCard = ({ name, path, setPath, children }: FolderCardProps): JSX.Element => {
	const [open, setOpen] = useState(false);

	const handleClick = (e: MouseEvent): void => {
		e.preventDefault();
		if (open) console.log(`Opening menu`);
		else console.log(`Closing menu`);
		setOpen(!open);
	};
	return (
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
			onClick={() => setPath(`${path}${name}/`)}
			onContextMenu={(e) => handleClick(e)}
		>
			<HStack w="100%">
				<Flex w="100%" justify="space-between" align="center">
					{children}
				</Flex>
			</HStack>
		</Box>
	);
};

export default FolderCard;
