import { Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';
import React from 'react';

type SideBarPropsType = {
	contactTab: string;
	myFilesTab: string;
	sharedFilesTab: string;
	uploadButton: JSX.Element;
	setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
	currentTabIndex: number;
};

const SideBar = ({
	contactTab,
	myFilesTab,
	sharedFilesTab,
	uploadButton,
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
				pb="64px"
			>
				Inter Planetary Cloud
			</Text>
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
				</TabList>
			</Tabs>
			{uploadButton}
		</VStack>
	</VStack>
);

export default SideBar;
