import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Divider, HStack, Icon, Text, useBreakpointValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FcFolder } from 'react-icons/fc';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFolder } from 'types/types';
import Button from 'components/Button';

type MoveFolderProps = {
	folder: IPCFolder;
};

const MoveFolder = ({ folder }: MoveFolderProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles, folders, setFolders } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	const [newPath, setNewPath] = useState('/');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setHasPermission(true);
		return () => {
			setHasPermission(false);
			setNewPath('/');
		};
	}, []);

	const moveFolder = async () => {
		setIsLoading(true);
		const fullPath = `${folder.path}${folder.name}/`;

		const moved = await user.contact.moveFolder(folder, newPath);

		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });
		setFiles(
			files.map((f) => {
				if (f.path.startsWith(fullPath)) return {
					...f,
					path: f.path.replace(folder.path, newPath),
					logs: [...f.logs, {
						action: `Moved folder to ${fullPath}`,
						date: Date.now()
					}]
				};
				return f;
			}),
		);

		setFolders(
			folders.map((f) => {
				if (f.path.startsWith(fullPath)) return { ...f, path: f.path.replace(folder.path, newPath) };
				if (f === folder) return { ...f, path: newPath };
				return f;
			}),
		);

		setNewPath('/');
		setIsLoading(false);
		onClose();
	};

	if (!hasPermission) return <></>;

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
				title="Move folder"
				CTA={
					<Button
						variant="primary"
						size="lg"
						onClick={moveFolder}
						isLoading={isLoading}
						id="ipc-dashboard-move-folder-confirm"
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
						id="ipc-move-folder-back-path-button"
					>
						<ArrowBackIcon fontSize="30" />
					</Button>
					<br />
					<br />
					{folders.filter((f) => f.path === newPath && f.createdAt !== folder.createdAt).length ? (
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
											<FcFolder display="flex" size="30"></FcFolder>
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

export default MoveFolder;
