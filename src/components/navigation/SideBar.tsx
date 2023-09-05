import { Text, useBreakpointValue, useColorMode, useColorModeValue, VStack } from '@chakra-ui/react';
import { BsCodeSlash, BsPeople, BsPerson, BsPlusLg, BsShareFill } from 'react-icons/bs';
import { IoTrashOutline } from 'react-icons/io5';
import { RiHardDrive2Line } from 'react-icons/ri';

import colors from 'theme/foundations/colors';

import Button from 'components/Button';
import DeployGithub from 'components/computing/github/DeployGithub';
import DeployProgram from 'components/computing/programs/DeployProgram';
import UploadFile from 'components/file/UploadFile';
import CreateFolder from 'components/folder/CreateFolder';

import { useUserContext } from 'contexts/user';

import useToggle from 'hooks/useToggle';

import ProfileBadge from 'components/profile/ProfileBadge';
import { bgColorMode } from 'config/colorMode';
import { NavbarType } from 'types/navbar';
import NavbarItem from './NavbarItem';
import UploadFolder from '../folder/UploadFolder';

const SideBar = (): JSX.Element => {
	const { user } = useUserContext();
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, lg: false }) || false;
	const { toggle, toggleHandler } = useToggle();
	const bgColor = useColorModeValue(bgColorMode.light, bgColorMode.dark);
	const { colorMode } = useColorMode();

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
		{
			label: 'Account',
			url: '/drive/account',
			icon: BsPerson,
		},
	];

	return (
		<VStack
			w="300px"
			h="100vh"
			p="32px"
			spacing="64px"
			bg={bgColor}
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
							border={`2px solid ${colorMode === 'light' ? colors.blue['100'] : '#595959'}`}
							_focus={{
								boxShadow: 'none',
							}}
							spacing="4px"
							p="8px"
							bg={colorMode === 'light' ? 'white' : 'gray.700'}
						>
							<UploadFolder />
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
				{isDrawerNeeded && (
					<ProfileBadge
						username={user?.fullContact.contact.username || 'IPC'}
						address={user?.account.address || 'IPC'}
					/>
				)}
			</VStack>
		</VStack>
	);
};

export default SideBar;
