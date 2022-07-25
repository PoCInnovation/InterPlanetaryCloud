import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserContext } from 'contexts/user';
import type { IPCFile } from 'types/types';

type FileRenameButtonProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenUpdateFileName: () => void;
};

const FileRenameButton = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenUpdateFileName,
}: FileRenameButtonProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
	}, []);

	if (!hasPermission) return <></>;

	return (
		<Button
			backgroundColor={'white'}
			justifyContent="flex-start"
			w="100%"
			p="0px"
			mx="4px"
			onClick={async () => {
				setSelectedFile(file);
				onOpenUpdateFileName();
			}}
			isLoading={isUpdateLoading}
			id="ipc-dashboard-update-filename-button"
		>
			Rename File
		</Button>
	);
};

type FileContentButtonProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenUpdateFileContent: () => void;
};

const FileContentButton = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenUpdateFileContent,
}: FileContentButtonProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
	}, []);

	if (!hasPermission) return <></>;

	return (
		<Button
			backgroundColor={'white'}
			justifyContent="flex-start"
			w="100%"
			p="0px"
			mx="4px"
			onClick={async () => {
				setSelectedFile(file);
				onOpenUpdateFileContent();
			}}
			isLoading={isUpdateLoading}
			id="ipc-dashboard-update-content-button"
		>
			Update File
		</Button>
	);
};

type FileDeleteButtonProps = {
	file: IPCFile;
	setSelectedFile: (file: IPCFile) => void;
	onOpenDeleteFile: () => void;
};

const FileDeleteButton = ({ file, setSelectedFile, onOpenDeleteFile }: FileDeleteButtonProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
	}, []);

	if (!hasPermission) return <></>;

	return (
		<Button
			backgroundColor={'white'}
			justifyContent="flex-start"
			w="100%"
			p="0px"
			mx="4px"
			onClick={async () => {
				setSelectedFile(file);
				onOpenDeleteFile();
			}}
			isLoading={false}
			id="ipc-dashboard-delete-file-button"
		>
			Delete File
		</Button>
	);
};

export { FileContentButton, FileRenameButton, FileDeleteButton };
