import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserContext } from 'contexts/user';
import type { IPCFile } from 'types/types';

type FileRenameButtonsProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenUpdateFileName: () => void;
};

const FileRenameButtons = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenUpdateFileName,
}: FileRenameButtonsProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
	}, []);

	if (!hasPermission) return <></>;

	return (
		<>
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
		</>
	);
};

type FileContentButtonsProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenUpdateFileContent: () => void;
};

const FileContentButtons = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenUpdateFileContent,
}: FileContentButtonsProps): JSX.Element => {
	const { user } = useUserContext();
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
	}, []);

	if (!hasPermission) return <></>;

	return (
		<>
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
		</>
	);
};

export { FileContentButtons, FileRenameButtons };
