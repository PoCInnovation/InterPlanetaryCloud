import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

import OutlineButton from './OutlineButton';

type PopupProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: JSX.Element;
	CTA?: JSX.Element;
};

const Popup = ({ isOpen, onClose, title, children, CTA }: PopupProps): JSX.Element => (
	<Modal isOpen={isOpen} onClose={onClose}>
		<ModalOverlay />
		<ModalContent w="75%">
			<ModalHeader
				fontSize={{ base: '16px', '3xs': '16px', xs: '22px' }}
				textAlign="center"
				bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
				bgClip="text"
			>
				{title}
			</ModalHeader>
			<ModalBody mt="16px" mb="32px">
				{children}
			</ModalBody>

			<ModalFooter flexDirection="column" alignItems="center">
				{CTA}
				<OutlineButton w="100%" text="Close" onClick={onClose} id="ipc-modal-close-button" />
			</ModalFooter>
		</ModalContent>
	</Modal>
);

export default Popup;
