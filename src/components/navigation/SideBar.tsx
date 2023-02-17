import { Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { IoTrashOutline } from 'react-icons/io5';
import { BsCodeSlash, BsPeople, BsPlusLg, BsShareFill } from 'react-icons/bs';
import { RiHardDrive2Line } from 'react-icons/ri';

import colors from 'theme/foundations/colors';

import UploadFile from 'components/file/UploadFile';
import CreateFolder from 'components/folder/CreateFolder';
import DeployProgram from 'components/computing/programs/DeployProgram';
import DeployGithub from 'components/computing/github/DeployGithub';
import Button from 'components/Button';

import { useUserContext } from 'contexts/user';

import useToggle from 'hooks/useToggle';

import { NavbarType } from 'types/navbar';
import ProfileBadge from '../dashboardPage/ProfileBadge';
import NavbarItem from './NavbarItem';

const SideBar = (): JSX.Element => {
	const { user } = useUserContext();

	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, xs: true, lg: false }) || false;
	const isBadgeDisplayed = useBreakpointValue({ base: true, md: false }) || false;

	const { toggle, toggleHandler } = useToggle();

	const tabs: NavbarType[] = [
		{
			label: 'My Drive',
			url: '/drive',
			icon: RiHardDrive2Line,
		},
		{
			label: 'Shared with me',
			url: '/drive/shared',
			icon: BsShareFill,
		},
		{
			label: 'My Programs',
			url: '/drive/programs',
			icon: BsCodeSlash,
		},
		{
			label: 'Contacts',
			url: '/drive/contacts',
			icon: BsPeople,
		},
		{
			label: 'Trash',
			url: '/drive/trash',
			icon: IoTrashOutline,
		},
	];

	return (
		<VStack
			w="300px"
			h="100vh"
			p="32px"
			spacing="64px"
			bg="white"
			borderRight={{ base: '', lg: `1px solid ${colors.gray['100']}` }}
		>
			<VStack w="100%" px="16px" spacing="32px">
				<VStack w="100%" spacing="16px">
					<VStack w="100%" spacing="32px">
						{isDrawerNeeded && (
							<Text size="2xl" variant="gradient" id="ipc-sideBar-title" align="center">
								Inter Planetary Cloud
							</Text>
						)}
						<Button
							variant="special"
							buttonType="left-icon"
							icon={BsPlusLg}
							size="xl"
							w="100%"
							className="ipc-new-elem-button"
							onClick={toggleHandler}
						>
							New
						</Button>
					</VStack>
					{toggle && (
						<VStack
							w="250px"
							borderRadius="8px"
							border="2px solid #E8EBFF"
							_focus={{
								boxShadow: 'none',
							}}
							spacing="4px"
							p="8px"
						>
							<CreateFolder />
							<UploadFile />
							<DeployProgram />
							<DeployGithub />
						</VStack>
					)}
				</VStack>

				<VStack spacing="16px" w="100%">
					{tabs.map((item) => (
						<NavbarItem item={item} key={item.label} />
					))}
				</VStack>
				{isBadgeDisplayed && (
					<ProfileBadge
						username={user ? user.contact.username : 'IPC'}
						address={(user ? user.account?.address : 'IPC') || 'IPC'}
					/>
				)}
			</VStack>
		</VStack>
	);

	// return (
	// 	<VStack
	// 		h="100vh"
	// 		minW="300px"
	// 		justify="space-between"
	// 		px="16px"
	// 		py="64px"
	// 		borderRadius="base"
	// 		boxShadow="0px 0px 0px 2px rgba(0, 0, 0, 0.1)"
	// 	>
	// 		<VStack spacing="32px" textAlign="center">
	// 			<Text
	// 				fontSize="20px"
	// 				fontWeight="bold"
	// 				bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
	// 				bgClip="text"
	// 				id="ipc-sideBar-title"
	// 			>
	// 				Inter Planetary Cloud
	// 			</Text>
	// 			{isDrawerNeeded ? (
	// 				<VStack w="100%">
	// 					<Button variant="inline" w="250px" borderRadius="lg" className="ipc-new-elem-button" onClick={toggleHandler}>
	// 						New Elem
	// 					</Button>
	// 					{toggle && (
	// 						<VStack
	// 							w="250px"
	// 							backgroundColor={configTheme ?? 'white'}
	// 							borderRadius="8px"
	// 							border="2px solid #E8EBFF"
	// 							_focus={{
	// 								boxShadow: 'none',
	// 							}}
	// 							spacing="4px"
	// 							p="8px"
	// 						>
	// 							<CreateFolder />
	// 							<UploadFile />
	// 							<DeployProgram />
	// 							<DeployGithub />
	// 						</VStack>
	// 					)}
	// 				</VStack>
	// 			) : (
	// 				<Popover placement="right-start">
	// 					<PopoverTrigger>
	// 						<Button variant="inline" w="80%" borderRadius="lg" className="ipc-new-elem-button">
	// 							New Elem
	// 						</Button>
	// 					</PopoverTrigger>
	// 					<Portal>
	// 						<PopoverContent
	// 							w="250px"
	// 							backgroundColor={configTheme ?? 'white'}
	// 							borderRadius="8px"
	// 							border="2px solid #E8EBFF"
	// 							_focus={{
	// 								boxShadow: 'none',
	// 							}}
	// 						>
	// 							<PopoverBody p="8px">
	// 								<VStack w="100%" spacing="4px">
	// 									<CreateFolder />
	// 									<UploadFile />
	// 									<DeployProgram />
	// 									<DeployGithub />
	// 								</VStack>
	// 							</PopoverBody>
	// 						</PopoverContent>
	// 					</Portal>
	// 				</Popover>
	// 			)}
	// 			<Tabs
	// 				defaultIndex={currentTabIndex}
	// 				orientation="vertical"
	// 				isFitted
	// 				onChange={(index) => setSelectedTab(index)}
	// 			>
	// 				<TabList>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{myFilesTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{sharedFilesTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{contactTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{myProgramsTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{profileTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{binTab}
	// 					</Tab>
	// 					<Tab
	// 						borderLeft={`5px solid ${colors.blue[700]}`}
	// 						_selected={{
	// 							borderLeft: `5px solid ${colors.red[700]}`,
	// 						}}
	// 					>
	// 						{configTab}
	// 					</Tab>
	// 				</TabList>
	// 			</Tabs>
	// 		</VStack>
	// 	</VStack>
	// );
};

export default SideBar;
