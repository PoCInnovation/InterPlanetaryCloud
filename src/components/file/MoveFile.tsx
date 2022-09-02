import { useState, useEffect } from 'react';
import { Button, Divider, HStack, useToast, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FcAdvance, FcFolder } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';
import { useConfigContext } from 'contexts/config';

type MoveFileProps = {
	file: IPCFile;
};

const MoveFile = ({ file }: MoveFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles, folders } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [newPath, setNewPath] = useState('/');
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => {
			setHasPermission(false);
			setNewPath('/');
		};
	}, []);

	const moveFile = async () => {
		setIsLoading(true);

		const moved = await user.contact.moveFile(file, newPath);
		toast({ title: moved.message, status: moved.success ? 'success' : 'error' });

		const index = files.indexOf(file);
		if (index !== -1) {
			files[index].path = newPath;
			setFiles([...files]);
		}
		setNewPath('/');
		setIsLoading(false);
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcAdvance size="30"></FcAdvance>{' '}
			<Button
				backgroundColor={config?.theme ?? 'white'}
				textColor={colorText}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={onOpen}
				isLoading={isLoading}
				id="ipc-dashboard-move-filebutton"
			>
				Move
			</Button>
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

export default MoveFile;
