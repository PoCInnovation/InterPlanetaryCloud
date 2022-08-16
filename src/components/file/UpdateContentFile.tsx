import { ChangeEvent, useState, useEffect } from 'react';
import { Button, Input, HStack, useToast, useDisclosure } from '@chakra-ui/react';
import { FcUpload } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { generateFileKey } from 'utils/generateFileKey';
import { getFileContent } from 'utils/fileManipulation';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

type UpdateContentFileProps = {
	file: IPCFile;
};

const UpdateContentFile = ({ file }: UpdateContentFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();
	const [hasPermission, setHasPermission] = useState(false);
	const toast = useToast({ duration: 2000, isClosable: true });

	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const permission = user.contact.hasEditPermission(file.hash);
		setHasPermission(permission.success);
		return () => setHasPermission(false);
	}, []);

	const updateContent = async () => {
		if (!fileEvent) return;

		const oldFile = file;
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();

		if (!fileContent) return;

		const newFile: IPCFile = {
			...oldFile,
			hash: fileContent,
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		};
		setIsLoading(true);
		const upload = await user.drive.upload(newFile, key);
		if (!upload.success || !upload.file) {
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
		} else {
			const updated = await user.contact.updateFileContent(upload.file, oldFile.hash);
			toast({ title: updated.message, status: updated.success ? 'success' : 'error' });
			if (updated.success && upload.file) {
				const index = files.indexOf(oldFile);
				if (index !== -1) files[index] = upload.file;
				setFiles(files);

				const deleted = await user.drive.delete([oldFile.hash]);
				toast({ title: deleted.message, status: deleted.success ? 'success' : 'error' });
			}
		}
		setIsLoading(false);
		onClose();
	};

	if (!hasPermission) return <></>;

	return (
		<HStack>
			<FcUpload size="30"></FcUpload>
			<Button
				backgroundColor={'white'}
				justifyContent="flex-start"
				w="100%"
				p="0px"
				mx="4px"
				onClick={async () => onOpen()}
				isLoading={isLoading}
				id="ipc-dashboard-update-content-button"
			>
				Update content
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Update file content from a file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={updateContent}
						isLoading={isLoading}
						id="ipc-dashboard-update-file-content-button"
					>
						Upload new version
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-input-new-file-content"
				/>
			</Modal>
		</HStack>
	);
};

export default UpdateContentFile;
