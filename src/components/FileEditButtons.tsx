import { Button, Icon } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { MdUpdate } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import { useUserContext } from 'contexts/user';
import type { IPCFile } from '../types/types';

type FileEditButtonsProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenUpdateFileName: () => void;
	onOpenUpdateFileContent: () => void;
};

export const FileEditButtons = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenUpdateFileName,
	onOpenUpdateFileContent,
}: FileEditButtonsProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		async function getToken() {
			const permission = await user.contact.hasEditPermission(file.hash);
			setHasPermission(permission.success);
		}
		getToken();
	}, []);

	if (!hasPermission) return <></>;

	return (
		<>
			<Button
				variant="inline"
				size="sm"
				w="100%"
				p="0px"
				mx="4px"
				onClick={async () => {
					setSelectedFile(file);
					onOpenUpdateFileName();
				}}
				isLoading={isUpdateLoading}
				id="ipc-dashboardView-update-filename-button"
			>
				<EditIcon />
			</Button>
			<Button
				variant="inline"
				size="sm"
				w="100%"
				p="0px"
				mx="4px"
				onClick={async () => {
					setSelectedFile(file);
					onOpenUpdateFileContent();
				}}
				isLoading={isUpdateLoading}
				id="ipc-dashboardView-update-content-button"
			>
				<Icon as={MdUpdate} />
			</Button>
		</>
	);
};
