import { PopoverTrigger, Text, Popover, PopoverContent, PopoverProps, Box } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const Tooltip = ({
	text,
	content,
	...props
}: {
	text?: string;
	content?: JSX.Element;
	color?: string;
} & PopoverProps): JSX.Element => (
	<Popover placement="auto" trigger="hover" {...props}>
		<PopoverTrigger>
			<Box p={{ base: '8px', xl: '4px' }}>
				<InfoIcon boxSize="16px" cursor="pointer" color="blue.1100" alignSelf="center" />
			</Box>
		</PopoverTrigger>
		<Box>
			<PopoverContent p={4}>
				{text && <Text size="md">{text}</Text>}
				{content}
			</PopoverContent>
		</Box>
	</Popover>
);

export default Tooltip;
