import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
	Divider,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FcFolder } from 'react-icons/fc';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';
import { textColorMode } from 'config/colorMode';

type MoveFileProps = {
	file: IPCFile;
	onClosePopover: () => void;
};

const MoveFile = ({ file, onClosePopover }: MoveFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles, folders } = useDriveContext();

	const [newPath, setNewPath] = useState('/');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const moveFile = async () => {
		setIsLoading(true);

<<<<<<< HEAD
		const moved = await user.fullContact.files.moveFile(file, newPath);
=======
		const moved = await user.fullContact.contact.moveFile(file, newPath);
>>>>>>> 7683ed9 (feat: replace user.contact by user.fullContact.contact)
		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

		const index = files.indexOf(file);
		if (index !== -1) {
			files[index].path = newPath;
			files[index].logs.push({
				action: `Moved file to ${newPath}`,
				date: Date.now(),
			});
			setFiles([...files]);
		}
		setNewPath('/');
		setIsLoading(false);
		onClose();
		onClosePopover();
	};

	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	if (file.permission !== 'owner') return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-move-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={MdOutlineDriveFileMove}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize="16px"
				fontWeight="400"
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={textColor}
			>
				Move to...
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Move file"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={moveFile}
						isLoading={isLoading}
						id="ipc-dashboard-move-file-button"
					>
						Move
					</Button>
				}
			>
				<>
					<Button
						variant="secondary"
						size="sm"
						disabled={newPath === '/'}
						onClick={() => setNewPath(newPath.replace(/([^/]+)\/$/, ''))}
						id="ipc-move-back-path-button"
					>
						<ArrowBackIcon fontSize="30" />
					</Button>
					<br />
					<br />
					{folders.filter((f) => f.path === newPath).length ? (
						folders
							.filter((f) => f.path === newPath)
							.map((f) => (
								<div key={f.createdAt}>
									<Divider />
									<HStack>
										<Button
											backgroundColor={'white'}
											w="100%"
											onClick={() => {
												setNewPath(`${newPath}${f.name}/`);
											}}
										>
											<FcFolder display="flex" size="30" />
											{f.name}
											<ChevronRightIcon />
										</Button>
									</HStack>
									<Divider />
								</div>
							))
					) : (
						<>
							<Divider />
							<HStack>
								<Button backgroundColor={'white'} w="100%">
									No folders
								</Button>
							</HStack>
							<Divider />
						</>
					)}
				</>
			</Modal>
		</HStack>
	);
};

export default MoveFile;
