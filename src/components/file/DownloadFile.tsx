import { HStack, Icon, Text, useBreakpointValue, useColorModeValue, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

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

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

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
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={downloadFile}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-download-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={FiDownload}
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
				Download
			</Text>
		</HStack>
	);
};

export default DownloadFile;
