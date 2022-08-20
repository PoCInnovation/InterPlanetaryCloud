import { Button, HStack, Input, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { FcFile } from 'react-icons/fc';
import { v4 as uuid } from 'uuid';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { extractFilename, getFileContent } from 'utils/fileManipulation';
import { generateFileKey } from 'utils/generateFileKey';

import { useConfigContext } from 'contexts/config';
import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

const UploadFile = (): JSX.Element => {
	const { user } = useUserContext();
	const { config } = useConfigContext();
	const { path, files, setFiles } = useDriveContext();
	const toast = useToast({ duration: 2000, isClosable: true });

	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const colorText = useColorModeValue('gray.800', 'white');

	const uploadFile = async () => {
		if (!fileEvent) return;
		setIsLoading(true);
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();
		if (!filename || !fileContent) {
			toast({ title: 'Invalid file', status: 'error' });
			setFileEvent(undefined);
			setIsLoading(false);
			return;
		}

		const file: IPCFile = {
			id: uuid(),
			name: filename,
			hash: fileContent,
			size: fileEvent.target.files![0].size,
			createdAt: Date.now(),
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
			path,
			permission: 'owner',
		};

		if (user.account) {
			const upload = await user.drive.upload(file, key);
			if (!upload.success || !upload.file) {
				toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
			} else {
				setFiles([...files, upload.file]);
				user.drive.files.push(upload.file);

				const shared = await user.contact.addFileToContact(user.account.address, upload.file);
				toast({ title: upload.message, status: shared.success ? 'success' : 'error' });
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		onClose();
		setFileEvent(undefined);
		setIsLoading(false);
	};

	return (
		<HStack>
			<FcFile display="flex" size="40"></FcFile>
			<Button
				w="100%"
				backgroundColor={config?.theme}
				textColor={colorText}
				justifyContent="flex-start"
				onClick={onOpen}
				isLoading={isLoading}
				id="ipc-upload-button"
			>
				Upload a file
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Upload a file"
				CTA={
					<Button
						variant="inline"
						w="100%"
						mb="16px"
						onClick={uploadFile}
						isLoading={isLoading}
						id="ipc-dashboard-upload-file-modal-button"
					>
						Upload file
					</Button>
				}
			>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-upload-file"
				/>
			</Modal>
		</HStack>
	);
};

export default UploadFile;
