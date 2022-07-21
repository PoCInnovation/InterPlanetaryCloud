import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserContext } from 'contexts/user';
import type { IPCFile } from 'types/types';

type MoveFileButtonProps = {
	file: IPCFile;
	isUpdateLoading: boolean;
	setSelectedFile: (file: IPCFile) => void;
	onOpenMoveFile: () => void;
};

const MoveFileButton = ({
	file,
	isUpdateLoading,
	setSelectedFile,
	onOpenMoveFile,
}: MoveFileButtonProps): JSX.Element => {
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
				onOpenMoveFile();
			}}
			isLoading={isUpdateLoading}
			id="ipc-dashboard-move-filebutton"
		>
			Move to..
		</Button>
	);
};

export default MoveFileButton;
