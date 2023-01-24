import { Box, HStack, Spacer, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import type { IPCFile } from 'types/types';

import ConfigPage from 'components/ConfigPage';
import ContactCards from 'components/ContactCards';
import DriveCards from 'components/DriveCards';
import ProfileCard from 'components/ProfileCard';
import ProgramCards from 'components/ProgramCards';
import DeleteBin from 'components/file/DeleteBin';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type CardsProps = {
	sharedFiles: IPCFile[];
	index: number;
	onOpenRedeployProgram: () => void;
	isRedeployLoading: boolean;
};

const DisplayCards = ({ sharedFiles, index, onOpenRedeployProgram, isRedeployLoading }: CardsProps): JSX.Element => {
	const { user } = useUserContext();
	const { path, files, folders } = useDriveContext();
	const colorText = useColorModeValue('gray.800', 'white');

	if (index === 0)
		return (
			<VStack w="100%" id="test" spacing="16px">
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
				<ProgramCards onOpenRedeployProgram={onOpenRedeployProgram} isRedeployLoading={isRedeployLoading} />
			</VStack>
		);
	if (index === 4) return <ProfileCard profile={user.contact.contacts[0]} />;
	if (index === 5) {
		const deletedFiles = files.filter((elem) => elem.path === path && elem.deletedAt !== null);
		const deletedFolders = folders.filter((elem) => elem.path === path);

		return (
			<VStack w="100%" id="test" spacing="16px" mt={{ base: '64px', lg: '0px' }}>
				<Box w="100%">
					<Text fontSize="35" textColor={colorText}>
						Your bin
					</Text>
				</Box>
				<DeleteBin files={deletedFiles} folders={deletedFolders} concernedFiles={sharedFiles} />
				<DriveCards files={deletedFiles} folders={deletedFolders} />
			</VStack>
		);
	}

	return <ConfigPage />;
};

export default DisplayCards;
