import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Divider, HStack, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FcAdvance, FcFolder } from 'react-icons/fc';

import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import type { IPCFolder } from 'types/types';

type MoveFolderProps = {
	folder: IPCFolder;
};

const MoveFolder = ({ folder }: MoveFolderProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles, folders, setFolders } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });

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
				if (f.path.startsWith(fullPath)) return { ...f, path: f.path.replace(folder.path, newPath) };
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
		<HStack>
			<FcAdvance size="30"></FcAdvance>
			<Button
				backgroundColor={'white'}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={onOpen}
				isLoading={isLoading}
				id="ipc-dashboard-move-folder-option"
			>
				Move
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Move folder"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
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
