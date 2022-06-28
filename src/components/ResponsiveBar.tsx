import {
	Box,
	Button,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Icon,
	SlideDirection,
	Text,
	useBreakpointValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import colors from 'theme/foundations/colors';
import Sidebar from 'components/SideBar';
import { UploadButton, DeployButton } from 'components/CustomButtons';

type BarProps = {
	onOpen: () => void;
	onOpenProgram: () => void;
	isUploadLoading: boolean;
	isDeployLoading: boolean;
	setSelectedTab: (tab: number) => void;
	selectedTab: number;
};

export const LeftBar = ({
	onOpen,
	onOpenProgram,
	isUploadLoading,
	isDeployLoading,
	setSelectedTab,
	selectedTab,
}: BarProps): JSX.Element => (
	<Sidebar
		uploadButton={<UploadButton text="Upload a file" onClick={() => onOpen()} isLoading={isUploadLoading} />}
		deployButton={<DeployButton text="Deploy a program" onClick={onOpenProgram} isLoading={isDeployLoading} />}
		contactTab="Contacts"
		myFilesTab="My files"
		myProgramsTab="My programs"
		profileTab="My profile"
		sharedFilesTab="Shared with me"
		setSelectedTab={setSelectedTab}
		currentTabIndex={selectedTab}
	/>
);

export const BarWithDrawer = ({
	onOpen,
	onOpenProgram,
	setSelectedTab,
	isDeployLoading,
	isUploadLoading,
	selectedTab,
}: BarProps): JSX.Element => {
	const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
	const placement: SlideDirection = 'left';

	return (
		<Box zIndex={100} position="relative" height="80px">
			<Drawer isOpen={isOpenDrawer} placement={placement} onClose={onCloseDrawer}>
				<DrawerOverlay />
				<DrawerContent w="75%">
					<LeftBar
						onOpen={onOpen}
						onOpenProgram={onOpenProgram}
						setSelectedTab={setSelectedTab}
						isUploadLoading={isUploadLoading}
						isDeployLoading={isDeployLoading}
						selectedTab={selectedTab}
					/>
				</DrawerContent>
			</Drawer>
			<Box as="nav" w="100vw" h="80px" position="fixed" left="0" top="0">
				<HStack w="100%" h="100%" px="24px" py="32px">
					<Button onClick={onOpenDrawer} _focus={{}} p="16px" id="ipc-dashboard-drawer-button" bg="transparent">
						<Icon fontSize="24px" as={HamburgerIcon} />
					</Button>

					<VStack textAlign="center" w="100%">
						<Text
							fontSize={{ base: '16px', sm: '24px' }}
							fontWeight="bold"
							bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
							bgClip="text"
							id="ipc-sideBar-title"
						>
							Inter Planetary Cloud
						</Text>
					</VStack>
				</HStack>
				<Divider />
			</Box>
		</Box>
	);
};

export const ResponsiveBar = ({
	onOpen,
	onOpenProgram,
	setSelectedTab,
	isUploadLoading,
	isDeployLoading,
	selectedTab,
}: BarProps): JSX.Element => {
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, xs: true, lg: false }) || false;

	if (!isDrawerNeeded)
		return (
			<LeftBar
				onOpen={onOpen}
				onOpenProgram={onOpenProgram}
				setSelectedTab={setSelectedTab}
				isUploadLoading={isUploadLoading}
				isDeployLoading={isDeployLoading}
				selectedTab={selectedTab}
			/>
		);
	return (
		<BarWithDrawer
			onOpen={onOpen}
			onOpenProgram={onOpenProgram}
			setSelectedTab={setSelectedTab}
			isUploadLoading={isUploadLoading}
			isDeployLoading={isDeployLoading}
			selectedTab={selectedTab}
		/>
	);
};
