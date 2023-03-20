import { HStack, Icon, Text, useBreakpointValue, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

import { useUserContext } from 'contexts/user';

import { textColorMode } from 'config/colorMode';
import type { IPCFile } from 'types/types';

type DownloadFileProps = {
	file: IPCFile;
	onClose: () => void;
};

const DownloadFile = ({ file, onClose }: DownloadFileProps): JSX.Element => {
	const { user } = useUserContext();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const toast = useToast({ duration: 2000, isClosable: true, id: 'ipc-download-file' });

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
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
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
				color={textColor}
			>
				Download
			</Text>
		</HStack>
	);
};

export default DownloadFile;
