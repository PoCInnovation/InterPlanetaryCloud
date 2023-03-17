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
			role="group"
			bg={router.pathname === item.url ? 'blue.50' : ''}
			onClick={() => router.push(item.url)}
			_hover={{
				bg: 'blue.50',
			}}
		>
			<Icon
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				as={item.icon}
				w="20px"
				h="20px"
				color={router.pathname === item.url ? 'red.800' : ''}
			/>
			<Text
				size="lg"
				fontWeight={router.pathname === item.url ? '500' : '400'}
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={router.pathname === item.url ? 'red.800' : ''}
			>
				{item.label}
			</Text>
		</HStack>
	);
};

export default NavbarItem;
