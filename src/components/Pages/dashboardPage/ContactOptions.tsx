import {
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Portal,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { IPCContact } from 'types/types';

import { useConfigContext } from 'contexts/config';

import CopyAddressContact from 'components/contact/CopyAddressContact';
import CopyPublicKeyContact from 'components/contact/CopyPublicKeyContact';

const ContactOptionsContent = ({ contact, onClose }: { contact: IPCContact; onClose: () => void }): JSX.Element => (
	<>
		<CopyAddressContact contact={contact} onClose={onClose} />
		<CopyPublicKeyContact contact={contact} onClose={onClose} />
	</>
);

const ContactOptionsPopover = ({
	contact,
	clickPosition,
	popoverOpeningToggle,
	popoverOpeningHandler,
}: {
	contact: IPCContact;
	clickPosition: { x: number; y: number };
	popoverOpeningToggle: boolean;
	popoverOpeningHandler: () => void;
}): JSX.Element => {
	const { config } = useConfigContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		if (popoverOpeningToggle) {
			popoverOpeningHandler();
			onOpen();
		}
	}, [popoverOpeningToggle]);

	return (
		<Popover placement="right-start" isOpen={isOpen} onClose={() => onClose()}>
			<PopoverTrigger>
				<Box position="fixed" w="1px" h="1px" bg="transparent" top={clickPosition.y} left={clickPosition.x} />
			</PopoverTrigger>
			<Portal>
				<PopoverContent
					w="250px"
					backgroundColor={config?.theme.value ?? 'white'}
					borderRadius="8px"
					border="2px solid #E8EBFF"
					_focus={{
						boxShadow: 'none',
					}}
				>
					<PopoverBody p="8px">
						<VStack w="100%" spacing="4px">
							<ContactOptionsContent contact={contact} onClose={onClose} />
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

const ContactOptionsDrawer = ({
	contact,
	isOpen,
	onClose,
}: {
	contact: IPCContact;
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element => (
	<Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
		<DrawerOverlay />
		<DrawerContent borderRadius="16px 16px 0px 0px">
			<DrawerBody px="16px" py="32px">
				<VStack w="100%" spacing="12px">
					<ContactOptionsContent contact={contact} onClose={onClose} />
				</VStack>
			</DrawerBody>
		</DrawerContent>
	</Drawer>
);

export { ContactOptionsPopover, ContactOptionsDrawer };
