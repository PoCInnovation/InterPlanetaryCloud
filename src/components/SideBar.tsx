import {
	Tab, TabList, Tabs, Text, VStack,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	Button,
	PopoverHeader,
	PopoverFooter,
	PopoverBody,
	HStack
} from '@chakra-ui/react';

import { FcFile, FcFolder, FcRules } from "react-icons/fc";

import colors from 'theme/foundations/colors';

type SideBarPropsType = {
	contactTab: string;
	myFilesTab: string;
	sharedFilesTab: string;
	myProgramsTab: string;
	profileTab: string;
	newElemButton: JSX.Element;
	uploadButton: JSX.Element;
	deployButton: JSX.Element;
	createFolderButton: JSX.Element;
	setSelectedTab: (tab: number) => void;
	currentTabIndex: number;
};

const SideBar = ({
	contactTab,
	myFilesTab,
	sharedFilesTab,
	myProgramsTab,
	profileTab,
	newElemButton,
	uploadButton,
	deployButton,
	createFolderButton,
	setSelectedTab,
	currentTabIndex,
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
			<Popover placement='right'>
				<PopoverTrigger>
					<Button variant="inline" w="80%" borderRadius="lg" id="ipc-deploy-button">New Elem</Button>
				</PopoverTrigger>
				<Portal>
					<PopoverContent w="300px">
						<PopoverHeader>
							<HStack>
								<FcFolder display="flex" size="40" ></FcFolder>
								{createFolderButton}
							</HStack>
						</PopoverHeader>
						<PopoverBody>
							<HStack>
								<FcFile display="flex" size="40"></FcFile>
								{uploadButton}
							</HStack>
						</PopoverBody>
						<PopoverFooter>
							<HStack>
								<FcRules display="flex" size="40" ></FcRules>
								{deployButton}
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
				</TabList>
			</Tabs>
		</VStack>
	</VStack>
);

export default SideBar;
