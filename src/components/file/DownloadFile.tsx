import { HStack, Icon, Text, useBreakpointValue, useToast, useColorMode } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

import { useUserContext } from 'contexts/user';

import type { IPCFile } from 'types/types';

type DownloadFileProps = {
	file: IPCFile;
	onClose: () => void;
};

const DownloadFile = ({ file, onClose }: DownloadFileProps): JSX.Element => {
	const { user } = useUserContext();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true });

	const downloadFile = async () => {
		try {
			const download = await user.drive.download(file);
			toast({ title: download.message, status: download.success ? 'success' : 'error' });
			onClose();
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to download file', status: 'error' });
		}
	};
	const { colorMode } = useColorMode();
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
				color={colorMode}
			>
				Download
			</Text>
		</HStack>
	);
};

export default DownloadFile;
