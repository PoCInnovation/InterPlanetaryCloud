import { useState } from 'react';
import {
	Button,
	Divider,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MdOutlineDriveFileMove } from 'react-icons/md';
import { FcFolder } from 'react-icons/fc';

import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFile } from 'types/types';

type MoveFileProps = {
	file: IPCFile;
};

const MoveFile = ({ file }: MoveFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles, folders } = useDriveContext();

	const [newPath, setNewPath] = useState('/');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const moveFile = async () => {
		setIsLoading(true);

		const moved = await user.contact.moveFile(file, newPath);
		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

		const index = files.indexOf(file);
		if (index !== -1) {
			files[index].path = newPath;
			files[index].logs.push({
				action: `Moved file to ${newPath}`,
				date: Date.now()
			})
			setFiles([...files]);
		}
		setNewPath('/');
		setIsLoading(false);
		onClose();
	};

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
				bg: 'blue.100',
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
			>
				Move to...
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Move file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
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
						backgroundColor={'white'}
						size="sm"
						w="10%"
						p="0px"
						mx="4px"
						boxShadow="1px 2px 3px 3px rgb(240, 240, 240)"
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
