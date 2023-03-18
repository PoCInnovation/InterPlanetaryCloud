import { HStack, Icon, Text, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import { BsClipboard } from 'react-icons/bs';

import type { IPCContact } from 'types/types';

type DownloadFileProps = {
	contact: IPCContact;
	onClose: () => void;
};

const CopyAddressContact = ({ contact, onClose }: DownloadFileProps): JSX.Element => {
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
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
				bg: 'blue.100',
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
				color={colorMode}
			>
				Copy the address
			</Text>
		</HStack>
	);
};

export default CopyAddressContact;
