import { HStack, Icon, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NavbarType } from 'types/navbar';
import { textColorMode } from 'config/colorMode';

const NavbarItem = ({ item }: { item: NavbarType }): JSX.Element => {
	const router = useRouter();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	const bgColor = colorMode === 'light' ? 'blue.100' : 'gray.750';
	const selectedTextColor = colorMode === 'light' ? 'red.800' : 'red.700';

	return (
		<HStack
			p="6px 12px"
			spacing="16px"
			w="100%"
			cursor="pointer"
			borderRadius="8px"
			role="group"
			bg={router.pathname === item.url ? bgColor : ''}
			onClick={() => router.push(item.url)}
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.700',
			}}
		>
			<Icon as={item.icon} w="20px" h="20px" color={router.pathname === item.url ? selectedTextColor : textColor} />
			<Text
				size="lg"
				fontWeight={router.pathname === item.url ? '500' : '400'}
				color={router.pathname === item.url ? selectedTextColor : textColor}
			>
				{item.label}
			</Text>
		</HStack>
	);
};

export default NavbarItem;
