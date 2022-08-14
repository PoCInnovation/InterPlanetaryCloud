import { Button, HStack, PopoverHeader, useColorModeValue, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FcDownload } from 'react-icons/fc';

import type { IPCFile } from 'types/types';

import { useConfigContext } from 'contexts/config';
import { useUserContext } from 'contexts/user';

type DownloadFileProps = {
	file: IPCFile;
};

const DownloadFile = ({ file }: DownloadFileProps): JSX.Element => {
	const { user } = useUserContext();
	const toast = useToast({ duration: 2000, isClosable: true });
	const { config } = useConfigContext();
	const colorText = useColorModeValue('gray.800', 'white');

	const [isLoading, setIsLoading] = useState(false);

	const downloadFile = async () => {
		setIsLoading(true);
		try {
			const download = await user.drive.download(file);
			toast({ title: download.message, status: download.success ? 'success' : 'error' });
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to download file', status: 'error' });
		}
		setIsLoading(false);
	};

	return (
		<PopoverHeader>
			<HStack>
				<FcDownload size="30"></FcDownload>
				<Button
					backgroundColor={config?.theme ?? 'white'}
					textColor={colorText}
					w="100%"
					p="0px"
					mx="4px"
					onClick={downloadFile}
					isLoading={isLoading}
					id="ipc-dashboard-download-button"
				>
					Download
				</Button>
			</HStack>
		</PopoverHeader>
	);
};

export default DownloadFile;
