import { PopoverTrigger, Text, Popover, PopoverContent, PopoverProps, Box, useColorModeValue } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { textColorMode } from 'config/colorMode';

const Tooltip = ({
	text,
	content,
	...props
}: {
	text?: string;
	content?: JSX.Element;
	color?: string;
} & PopoverProps): JSX.Element => {
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	return (
		<Popover placement="auto" trigger="hover" {...props}>
			<PopoverTrigger>
				<Box p={{ base: '8px', xl: '4px' }}>
					<InfoIcon boxSize="16px" cursor="pointer" color={textColor} alignSelf="center" />
				</Box>
			</PopoverTrigger>
			<Box>
				<PopoverContent p={4}>
					{text && (
						<Text size="md" color={textColor}>
							{text}
						</Text>
					)}
					{content}
				</PopoverContent>
			</Box>
		</Popover>
	);
};

export default Tooltip;
