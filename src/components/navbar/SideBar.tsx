import {
	Button,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Portal,
	Tab,
	TabList,
	Tabs,
	Text,
	useBreakpointValue,
	VStack,
} from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

import UploadFile from 'components/file/UploadFile';
import CreateFolder from 'components/folder/CreateFolder';
import DeployProgram from 'components/computing/programs/DeployProgram';
import DeployGithub from 'components/computing/github/DeployGithub';

import useToggle from 'hooks/useToggle';

type SideBarPropsType = {
	contactTab: string;
	myFilesTab: string;
	sharedFilesTab: string;
	myProgramsTab: string;
	profileTab: string;
	binTab: string;
	configTab: string;
	setSelectedTab: (tab: number) => void;
	currentTabIndex: number;
	configTheme: string;
};

const SideBar = ({
	contactTab,
	myFilesTab,
	sharedFilesTab,
	myProgramsTab,
	profileTab,
	binTab,
	configTab,
	setSelectedTab,
	currentTabIndex,
	configTheme,
}: SideBarPropsType): JSX.Element => {
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, xs: true, lg: false }) || false;
	const { toggle, toggleHandler } = useToggle();

	return (
		<VStack
			h="100vh"
			minW="300px"
			justify="space-between"
			px="16px"
			py="64px"
			borderRadius="base"
			boxShadow="0px 0px 0px 2px rgba(0, 0, 0, 0.1)"
		>
			<VStack spacing="32px" textAlign="center">
				<Text
					fontSize="20px"
					fontWeight="bold"
					bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
					bgClip="text"
					id="ipc-sideBar-title"
				>
					Inter Planetary Cloud
				</Text>
				{isDrawerNeeded ? (
					<VStack w="100%">
						<Button variant="inline" w="250px" borderRadius="lg" className="ipc-new-elem-button" onClick={toggleHandler}>
							New Elem
						</Button>
						{toggle && (
							<VStack
								w="250px"
								backgroundColor={configTheme ?? 'white'}
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
				) : (
					<Popover placement="right-start">
						<PopoverTrigger>
							<Button variant="inline" w="80%" borderRadius="lg" className="ipc-new-elem-button">
								New Elem
							</Button>
						</PopoverTrigger>
						<Portal>
							<PopoverContent
								w="250px"
								backgroundColor={configTheme ?? 'white'}
								borderRadius="8px"
								border="2px solid #E8EBFF"
								_focus={{
									boxShadow: 'none',
								}}
							>
								<PopoverBody p="8px">
									<VStack w="100%" spacing="4px">
										<CreateFolder />
										<UploadFile />
										<DeployProgram />
										<DeployGithub />
									</VStack>
								</PopoverBody>
							</PopoverContent>
						</Portal>
					</Popover>
				)}
				<Tabs
					defaultIndex={currentTabIndex}
					orientation="vertical"
					isFitted
					onChange={(index) => setSelectedTab(index)}
				>
					<TabList>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{myFilesTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{sharedFilesTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{contactTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{myProgramsTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{profileTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{binTab}
						</Tab>
						<Tab
							borderLeft={`5px solid ${colors.blue[700]}`}
							_selected={{
								borderLeft: `5px solid ${colors.red[700]}`,
							}}
						>
							{configTab}
						</Tab>
					</TabList>
				</Tabs>
			</VStack>
		</VStack>
	);
};

export default SideBar;
