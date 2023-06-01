import { Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';

import Button from 'components/Button';
import Modal from 'components/Modal';

import { useDriveContext } from 'contexts/drive';
import { useUserContext } from 'contexts/user';

import { IPCFile, IPCFolder } from 'types/types';
import { textColorMode } from 'config/colorMode';

type DeleteBinProps = {
	files: IPCFile[];
	folders: IPCFolder[];
	concernedFiles: IPCFile[];
};

const DeleteBin = ({ files, folders, concernedFiles }: DeleteBinProps): JSX.Element => {
	const toast = useToast({ duration: 2000, isClosable: true });
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

	const { user } = useUserContext();
	const { setFiles } = useDriveContext();

	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const deleteAllFiles = async () => {
		setIsLoading(true);
		if (user.account) {
			const deleted = await user.drive.delete(files.map((file) => file.hash));
			if (deleted.success) {
				const removed = await user.fullContact.contact.deleteFiles(
					files.map((file) => file.id),
					concernedFiles,
				);

				if (!removed.success) {
					toast({ title: removed.message, status: 'error' });
				} else {
					setFiles(user.drive.files);
					toast({ title: 'All the files in your bin have been deleted.', status: 'success' });
				}
			}
		} else {
			toast({ title: 'Failed to load account', status: 'error' });
		}
		setIsLoading(false);
		onClose();
	};

	if (files.length === 0 && folders.length === 0) {
		return (
			<Text fontSize="24" textColor={textColor}>
				Your bin is empty
			</Text>
		);
	}

	return (
		<>
			<Button buttonType="left-icon" icon={BsPlusLg} size="lg" variant="primary" onClick={onOpen} isLoading={isLoading}>
				Delete all the files
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Delete the bin"
				CTA={
					<Button variant="primary" size="lg" onClick={deleteAllFiles} id="ipc-dashboard-delete-bin-button">
						Delete the bin
					</Button>
				}
			>
				<Text size="lg" color={textColor}>
					Are you sure you want to delete all the files in your bin?
				</Text>
			</Modal>
		</>
	);
};

export default DeleteBin;
