import { Button, HStack, Input, PopoverFooter, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { FcUpload } from 'react-icons/fc';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { getFileContent } from 'utils/fileManipulation';
import { generateFileKey } from 'utils/generateFileKey';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

type UpdateContentFileProps = {
	file: IPCFile;
};

const UpdateContentFile = ({ file }: UpdateContentFileProps): JSX.Element => {
	const { user } = useUserContext();
	const { files, setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

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

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<PopoverFooter>
			<HStack>
				<FcUpload size="30"></FcUpload>
				<Button
					backgroundColor={config?.theme ?? 'white'}
					textColor={colorText}
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
		</PopoverFooter>
	);
};

export default UpdateContentFile;
