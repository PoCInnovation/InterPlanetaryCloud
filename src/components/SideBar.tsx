import {
	Tab,
	TabList,
	Tabs,
	Text,
	VStack,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	Button,
	PopoverHeader,
	PopoverFooter,
	PopoverBody,
	HStack,
} from '@chakra-ui/react';

import { FcRules } from 'react-icons/fc';
import { GoMarkGithub } from 'react-icons/go';

import colors from 'theme/foundations/colors';

import CreateFolder from 'components/folder/CreateFolder';
import UploadFile from './file/UploadFile';

type SideBarPropsType = {
	contactTab: string;
	myFilesTab: string;
	sharedFilesTab: string;
	myProgramsTab: string;
	profileTab: string;
	configTab: string;
	deployButton: JSX.Element;
	setSelectedTab: (tab: number) => void;
	githubButton: JSX.Element;
	currentTabIndex: number;
	configTheme: string;
};

const SideBar = ({
	contactTab,
	myFilesTab,
	sharedFilesTab,
	myProgramsTab,
	profileTab,
	configTab,
	deployButton,
	githubButton,
	setSelectedTab,
	currentTabIndex,
	configTheme,
}: SideBarPropsType): JSX.Element => (
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
			<Popover placement="right">
				<PopoverTrigger>
					<Button variant="inline" w="80%" borderRadius="lg" className="ipc-new-elem-button">
						New Elem
					</Button>
				</PopoverTrigger>
				<Portal>
					<PopoverContent w="300px" bg={configTheme}>
						<PopoverHeader>
							<CreateFolder />
						</PopoverHeader>
						<PopoverBody>
							<UploadFile />
						</PopoverBody>
						<PopoverFooter>
							<HStack>
								<FcRules display="flex" size="40"></FcRules>
								{deployButton}
							</HStack>
						</PopoverFooter>
						<PopoverFooter>
							<HStack>
								<GoMarkGithub display="flex" size="40"></GoMarkGithub>
								{githubButton}
							</HStack>
						</PopoverFooter>
					</PopoverContent>
				</Portal>
			</Popover>
			<Tabs defaultIndex={currentTabIndex} orientation="vertical" isFitted onChange={(index) => setSelectedTab(index)}>
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
						{configTab}
					</Tab>
				</TabList>
			</Tabs>
		</VStack>
	</VStack>
);

export default SideBar;
