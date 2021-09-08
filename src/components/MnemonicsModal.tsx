import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import colors from 'theme/foundations/colors';

type MnemonicsModalProps = {
	mnemonics: string;
	isOpen: boolean;
	onClose: () => void;
};

const MnemonicsModal = ({ mnemonics, isOpen, onClose }: MnemonicsModalProps): JSX.Element => {
	const toast = useToast();

	const onClick = () => {
		navigator.clipboard.writeText(mnemonics);
		toast({
			title: 'Copy to clipboard !',
			status: 'success',
			duration: 2000,
			isClosable: true,
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader textAlign="center">Your Mnemonics</ModalHeader>
				<ModalBody>
					<Textarea
						value={mnemonics}
						_focus={{ boxShadow: `0px 0px 0px 2px ${colors.red[300]}` }}
						cursor="text"
						readOnly
					/>
				</ModalBody>

				<ModalFooter flexDirection="column" alignItems="center">
					<Button variant="inline" mr={3} onClick={onClick} w="100%" mb="16px">
						Copy my mnemonics
					</Button>
					<Button variant="outline" size="sm" onClick={onClose} w="100%">
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MnemonicsModal;
