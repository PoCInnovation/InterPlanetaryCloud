import { HStack, Icon, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NavbarType } from 'types/navbar';

const NavbarItem = ({ item }: { item: NavbarType }): JSX.Element => {
	const router = useRouter();

	return (
		<HStack
			p="6px 12px"
			spacing="16px"
			w="100%"
			cursor="pointer"
			borderRadius="8px"
			bg={router.pathname.includes(item.url) ? 'blue.100' : ''}
			onClick={() => router.push(item.url)}
			_hover={{
				bg: 'blue.50',
			}}
		>
			<Icon as={item.icon} w="20px" h="20px" color={router.pathname.includes(item.url) ? 'red.800' : '#000000'} />
			<Text
				size="lg"
				fontWeight={router.pathname.includes(item.url) ? '500' : '400'}
				color={router.pathname.includes(item.url) ? 'red.800' : '#000000'}
			>
				{item.label}
			</Text>
		</HStack>
	);
};

export default NavbarItem;
