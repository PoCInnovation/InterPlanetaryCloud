import { Box, HStack, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFillFilePersonFill } from 'react-icons/bs';

import { IPCContact, IPCFile } from 'types/types';

import useToggle from 'hooks/useToggle';

import { useDriveContext } from 'contexts/drive';

import Card from './Card';
import { FileOptionsDrawer, FileOptionsPopover } from '../dashboardPage/FileOptions';
import formatDate from '../../utils/formatDate';
import { useUserContext } from '../../contexts/user';
import formatFileSize from '../../utils/formatFileSize';
import { ContactOptionsDrawer, ContactOptionsPopover } from '../dashboardPage/ContactOptions';

const ContactCard = ({ contact }: { contact: IPCContact }): JSX.Element => {
	const { files } = useDriveContext();
	const {
		user: {
			contact: { username },
		},
	} = useUserContext();

	const { isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile } = useDisclosure();
	const { toggle: popoverOpeningToggleFile, toggleHandler: popoverOpeningHandlerFile } = useToggle();

	const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	return (
		<Card
			key={contact.address}
			className="ipc-file-popover-button"
			onContextMenu={(e) => {
				e.preventDefault();
				if (!isDrawer) {
					setClickPosition({ x: e.clientX, y: e.clientY });
					popoverOpeningHandlerFile();
				} else onOpenFile();
			}}
		>
			<>
				<HStack w="100%" justify="space-between">
					<HStack spacing="16px">
						<BsFillFilePersonFill size="24px" />
						<Text size="lg">
							{contact.name} - {contact.address}
						</Text>
					</HStack>
					<HStack spacing="32px">
						<Text>{formatDate(contact.createdAt)}</Text>
					</HStack>
				</HStack>
				<Box>
					{isDrawer ? (
						<ContactOptionsDrawer contact={contact} isOpen={isOpenFile} onClose={onCloseFile} />
					) : (
						<ContactOptionsPopover
							contact={contact}
							clickPosition={clickPosition}
							popoverOpeningToggle={popoverOpeningToggleFile}
							popoverOpeningHandler={popoverOpeningHandlerFile}
						/>
					)}
				</Box>
			</>
		</Card>
	);
};

export default ContactCard;
