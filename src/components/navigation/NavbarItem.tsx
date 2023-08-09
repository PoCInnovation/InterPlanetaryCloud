import { HStack, Icon, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import {usePathname, useRouter} from 'next/navigation';

import { NavbarType } from 'types/navbar';
import { textColorMode } from 'config/colorMode';
import {ReactElement} from "react";

const NavbarItem = ({ item }: { item: NavbarType }): ReactElement => {
	const router = useRouter();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();
	const pathName = usePathname();

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
			bg={pathName === item.url ? bgColor : ''}
			onClick={() => router.push(item.url)}
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.700',
			}}
		>
			<Icon as={item.icon} w="20px" h="20px" color={pathName === item.url ? selectedTextColor : textColor} />
			<Text
				size="lg"
				fontWeight={pathName === item.url ? '500' : '400'}
				color={pathName === item.url ? selectedTextColor : textColor}
			>
				{item.label}
			</Text>
		</HStack>
	);
};

export default NavbarItem;
