import { ChangeEvent, useEffect, useState } from 'react';

import { Box, VStack, Button, HStack, useDisclosure, useToast, Input } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

import { useUserContext } from 'contexts/user';

import { IPCFile } from 'lib/user';

import Modal from 'components/Modal';
import Sidebar from 'components/SideBar';
import FileCard from 'components/FileCard';
import UploadButton from 'components/UploadButton';

const extractFilename = (filepath: string) => {
	const result = /[^\\]*$/.exec(filepath);
	return result && result.length ? result[0] : '';
};

const getFileContent = (file: unknown): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onload = (event: unknown) => {
			// eslint-disable-next-line
			resolve((event as any).target.result);
		};
		reader.onerror = (event) => {
			reject(event);
		};
		reader.readAsText(file as Blob);
	});

const Dashboard = (): JSX.Element => {
	const toast = useToast();
	const { user } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isUploadLoading, setIsUploadLoading] = useState(false);
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);
	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);

	useEffect(() => {
		user.drive.load();
	});

	const uploadFile = async () => {
		if (!fileEvent) return;
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		if (!filename || !fileContent) return;

		setIsUploadLoading(true);
		try {
			await user.drive.upload({
				name: filename,
				content: fileContent,
				created_at: Date.now(),
			});
			toast({
				title: 'File uploaded',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			onClose();
		} catch (error) {
			console.error(error);
			toast({
				title: 'Unable to upload the file',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
		setIsUploadLoading(false);
	};

	const downloadFile = async (file: IPCFile) => {
		setIsDownloadLoading(true);
		user.drive.download(file);
		setIsDownloadLoading(false);
	};

	return (
		<HStack minH="100vh" minW="100vw" align="start">
			<Sidebar
				uploadButton={<UploadButton text="Upload a file" onClick={() => onOpen()} isLoading={isUploadLoading} />}
			/>
			<Box w="100%" m="32px !important">
				<VStack w="100%" maxW="400px" id="test" spacing="16px">
					{user.drive.files.map((file) => (
						<FileCard file={file}>
							<Button variant="inline" size="sm" onClick={async () => downloadFile(file)} isLoading={isDownloadLoading}>
								<DownloadIcon />
							</Button>
						</FileCard>
					))}
				</VStack>
			</Box>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Upload a file"
				CTA={
					<Button variant="inline" w="100%" mb="16px" onClick={uploadFile} isLoading={isUploadLoading}>
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
				/>
			</Modal>
		</HStack>
	);
};

export default Dashboard;
