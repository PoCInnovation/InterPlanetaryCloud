import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Drawer,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useDisclosure,
	useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Sidebar from 'components/navigation/SideBar';

import colors from 'theme/foundations/colors';

import { useUserContext } from 'contexts/user';

import ProfileBadge from 'components/profile/ProfileBadge';

type BarProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const BarWithDrawer = ({ isOpen, onClose }: BarProps): JSX.Element => (
	<Drawer isOpen={isOpen} placement="left" onClose={onClose} id="ipc-dashboard-drawer-overlay">
		<DrawerOverlay />
		<DrawerContent w="75%">
			<DrawerCloseButton />
			<Sidebar />
		</DrawerContent>
	</Drawer>
);

export const ResponsiveBar = (): JSX.Element => {
	const { user } = useUserContext();

	const router = useRouter();
	const { colorMode } = useColorMode();
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, lg: false }) || false;
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box as="nav" w="100vw" h="80px" position="fixed" left="0" top="0" zIndex={10} bg={colorMode}>
			<HStack
				w="100%"
				h="100%"
				p={{ base: '32px 16px', lg: '32px 48px' }}
				justify="space-between"
				borderBottom={`1px solid ${colors.gray['100']}`}
			>
				<HStack spacing="16px">
					{isDrawerNeeded && (
						<Button onClick={onOpen} _focus={{}} p="16px" id="ipc-dashboard-drawer-button" bg="transparent">
							<Icon fontSize="24px" as={HamburgerIcon} />
						</Button>
					)}

					<Text
						size="2xl"
						variant="gradient"
						id="ipc-sideBar-title"
						cursor="pointer"
						onClick={() => router.push('/drive')}
					>
						Inter Planetary Cloud
					</Text>
				</HStack>

				{!isDrawerNeeded && (
					<ProfileBadge
						username={(user ? user.contact.username : 'IPC') || 'IPC'}
						address={(user ? user.account?.address : 'IPC') || 'IPC'}
					/>
				)}
			</HStack>
			{!isDrawerNeeded ? <Sidebar /> : <BarWithDrawer isOpen={isOpen} onClose={onClose} />}
		</Box>
	);
};
