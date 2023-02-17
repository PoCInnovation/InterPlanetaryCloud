import { HStack, Icon, Text, useBreakpointValue, useToast } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

import { useUserContext } from 'contexts/user';

import type { IPCContact, IPCFile } from 'types/types';
import { BsClipboard } from 'react-icons/bs';

type DownloadFileProps = {
	contact: IPCContact;
	onClose: () => void;
};

const CopyPublicKeyContact = ({ contact, onClose }: DownloadFileProps): JSX.Element => {
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={() => {
				navigator.clipboard.writeText(contact.publicKey);
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
			>
				Copy the public key
			</Text>
		</HStack>
	);
};

export default CopyPublicKeyContact;
