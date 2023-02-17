import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Icon,
	Link,
	SlideDirection,
	Text,
	useBreakpointValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';

import Sidebar from 'components/navigation/SideBar';

import colors from 'theme/foundations/colors';
import { useRouter } from 'next/router';
import ProfileBadge from '../dashboardPage/ProfileBadge';
import { useUserContext } from '../../contexts/user';

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

	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, lg: false }) || false;
	const isBadgeDisplayed = useBreakpointValue({ base: false, md: true }) || false;
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box as="nav" w="100vw" h="80px" position="fixed" left="0" top="0" zIndex={10} bg="white">
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

				{isBadgeDisplayed && (
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
