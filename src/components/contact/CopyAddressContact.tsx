import { HStack, Icon, Text, useBreakpointValue, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { BsClipboard } from 'react-icons/bs';

import type { IPCContact } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DownloadFileProps = {
	contact: IPCContact;
	onClose: () => void;
};

const CopyAddressContact = ({ contact, onClose }: DownloadFileProps): JSX.Element => {
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={() => {
				navigator.clipboard.writeText(contact.address);
				onClose();
			}}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-download-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={BsClipboard}
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
				Copy the address
			</Text>
		</HStack>
	);
};

export default CopyAddressContact;
