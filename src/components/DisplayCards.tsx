import { Box, Button, HStack, Spacer, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import type { IPCFile, IPCProgram } from 'types/types';

import ConfigPage from 'components/ConfigPage';
import ContactCards from 'components/ContactCards';
import DriveCards from 'components/DriveCards';
import ProfileCard from 'components/ProfileCard';
import ProgramCards from 'components/ProgramCards';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type CardsProps = {
	myPrograms: IPCProgram[];
	sharedFiles: IPCFile[];
	index: number;
	onOpenRedeployProgram: () => void;
	isRedeployLoading: boolean;
	setSelectedProgram: (program: IPCProgram) => void;
};

export const DisplayCards = ({
	myPrograms,
	sharedFiles,
	index,
	onOpenRedeployProgram,
	isRedeployLoading,
	setSelectedProgram,
}: CardsProps): JSX.Element => {
	const { user } = useUserContext();
	const { path, files, folders } = useDriveContext();
	const colorText = useColorModeValue('gray.800', 'white');

	if (index === 0)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35" textColor={colorText}>
						My Files
					</Text>
				</Box>
				<HStack w="100%">
					<Box>
						<Text marginLeft="10" textColor={colorText}>
							Name
						</Text>
					</Box>
					<Spacer />
					<Box>
						<Text align="center" textColor={colorText}>
							Latest upload on Aleph
						</Text>
					</Box>
					<Spacer />
					<Box>
						<Text align="center" textColor={colorText}>
							File Size
						</Text>
					</Box>
				</HStack>
				<DriveCards
					files={files.filter((elem) => elem.path === path && !elem.deletedAt)}
					folders={folders.filter((elem) => elem.path === path)}
				/>
			</VStack>
		);
	if (index === 1)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35" textColor={colorText}>
						Shared with me
					</Text>
				</Box>
				<DriveCards files={sharedFiles} folders={[]} />
			</VStack>
		);
	if (index === 2) return <ContactCards contacts={user.contact.contacts} />;
	if (index === 3)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35" textColor={colorText}>
						My Programs
					</Text>
				</Box>
				<HStack w="100%">
					<Box>
						<Text marginLeft="10" textColor={colorText}>
							Name
						</Text>
					</Box>
					<Spacer />
					<Box>
						<Text align="center" textColor={colorText}>
							Latest upload on Aleph
						</Text>
					</Box>
				</HStack>
				<ProgramCards
					programs={myPrograms}
					onOpenRedeployProgram={onOpenRedeployProgram}
					isRedeployLoading={isRedeployLoading}
					setSelectedProgram={setSelectedProgram}
				/>
			</VStack>
		);
	if (index === 4) return <ProfileCard profile={user.contact.contacts[0]} />;
	if (index === 6)
		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35" textColor={colorText}>
						Your bin
					</Text>
				</Box>
				<DriveCards
					files={files.filter((elem) => elem.path === path && elem.deletedAt !== null)}
					folders={folders.filter((elem) => elem.path === path)}
				/>
				<Button variant="inline">Delete all files</Button>
			</VStack>
		);
	return <ConfigPage />;
};
