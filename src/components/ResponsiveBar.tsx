import { HamburgerIcon } from '@chakra-ui/icons';
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

import colors from 'theme/foundations/colors';

import { DeployButton, GithubDeployButton } from 'components/CustomButtons';
import Sidebar from 'components/SideBar';

type BarProps = {
	onOpenProgram: () => void;
	isDeployLoading: boolean;
	onOpenGithub: () => void;
	setSelectedTab: (tab: number) => void;
	isGithubLoading: boolean;
	selectedTab: number;
	configTheme: string;
};

export const LeftBar = ({
	onOpenProgram,
	isDeployLoading,
	isGithubLoading,
	onOpenGithub,
	setSelectedTab,
	selectedTab,
	configTheme,
}: BarProps): JSX.Element => (
	<Sidebar
		deployButton={<DeployButton onClick={onOpenProgram} isLoading={isDeployLoading} />}
		githubButton={<GithubDeployButton onClick={onOpenGithub} isLoading={isGithubLoading} />}
		contactTab="Contacts"
		myFilesTab="My files"
		myProgramsTab="My programs"
		profileTab="My profile"
		configTab="Config"
		sharedFilesTab="Shared with me"
		setSelectedTab={setSelectedTab}
		currentTabIndex={selectedTab}
		configTheme={configTheme}
	/>
);

export const BarWithDrawer = ({
	onOpenProgram,
	setSelectedTab,
	isDeployLoading,
	onOpenGithub,
	isGithubLoading,
	selectedTab,
	configTheme,
}: BarProps): JSX.Element => {
	const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
	const placement: SlideDirection = 'left';

	return (
		<Box zIndex={100} position="relative" height="80px">
			<Drawer isOpen={isOpenDrawer} placement={placement} onClose={onCloseDrawer}>
				<DrawerOverlay />
				<DrawerContent w="75%">
					<LeftBar
						onOpenProgram={onOpenProgram}
						onOpenGithub={onOpenGithub}
						isGithubLoading={isGithubLoading}
						setSelectedTab={setSelectedTab}
						isDeployLoading={isDeployLoading}
						selectedTab={selectedTab}
						configTheme={configTheme}
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
	onOpenProgram,
	onOpenGithub,
	isGithubLoading,
	setSelectedTab,
	isDeployLoading,
	selectedTab,
	configTheme,
}: BarProps): JSX.Element => {
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, xs: true, lg: false }) || false;

	if (!isDrawerNeeded)
		return (
			<LeftBar
				onOpenProgram={onOpenProgram}
				onOpenGithub={onOpenGithub}
				isGithubLoading={isGithubLoading}
				setSelectedTab={setSelectedTab}
				isDeployLoading={isDeployLoading}
				selectedTab={selectedTab}
				configTheme={configTheme}
			/>
		);
	return (
		<BarWithDrawer
			onOpenProgram={onOpenProgram}
			setSelectedTab={setSelectedTab}
			onOpenGithub={onOpenGithub}
			isGithubLoading={isGithubLoading}
			isDeployLoading={isDeployLoading}
			selectedTab={selectedTab}
			configTheme={configTheme}
		/>
	);
};
