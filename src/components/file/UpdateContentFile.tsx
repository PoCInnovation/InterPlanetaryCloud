import {
	Button,
	HStack,
	Icon,
	Input,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { GoSync } from 'react-icons/go';

import Modal from 'components/Modal';
import type { IPCFile } from 'types/types';

import { getFileContent } from 'utils/fileManipulation';
import generateFileKey from 'utils/generateFileKey';

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

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	const updateContent = async () => {
		if (!fileEvent) return;

		const oldFile = file;
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		const key = generateFileKey();

		if (!fileContent) return;

		const newFile: IPCFile = {
			...oldFile,
			hash: fileContent,
			size: fileEvent.target.files![0].size,
			key: { iv: '', ephemPublicKey: '', ciphertext: '', mac: '' },
		};
		setIsLoading(true);
		const upload = await user.drive.upload(newFile, key);
		if (!upload.success || !upload.file) {
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
		} else {
			const updated = await user.contact.updateFileContent(upload.file);
			toast({ title: updated.message, status: updated.success ? 'success' : 'error' });
			if (updated.success && upload.file) {
				const index = files.indexOf(oldFile);
				if (index !== -1) files[index] = upload.file;
				setFiles(files);

				await user.drive.delete([oldFile.hash]);
			}
		}
		setIsLoading(false);
		onClose();
	};

	if (!['owner', 'editor'].includes(file.permission)) return <></>;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={GoSync}
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
				Update the content
			</Text>
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
