import { Box, Text, VStack } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';

type FolderCardProps = {
	name: string;
};

const FolderCard = ({ name }: FolderCardProps): JSX.Element => {
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
			border="1px solid rgb(200, 200, 200)"
			mb="8px"
			display="flex"
			justifyContent="space-between"
			onContextMenu={(e) => handleClick(e)}
		>
			<VStack w="100%" justify="space-between" align="center">
				<Text fontWeight="500" isTruncated maxW="100%">
					{name}
				</Text>
			</VStack>
		</Box>
	);
};

export default FolderCard;
