import { ChangeEvent, useState } from 'react';
import { Button, Input, useToast } from '@chakra-ui/react';
import CustomProgram from '../CustomProgram';
import Modal from '../../Modal';
import { IPCProgram } from '../../../types/types';
import { extractFilename } from '../../../utils/fileManipulation';
import { useUserContext } from '../../../contexts/user';
import { useDriveContext } from '../../../contexts/drive';

const ProgramModal = ({
	isOpen,
	onClose,
	selectedProgram,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedProgram?: IPCProgram;
}): JSX.Element => {
	const { user } = useUserContext();
	const { setPrograms } = useDriveContext();

	const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
	const [isDeployLoading, setIsDeployLoading] = useState(false);
	const [customName, setCustomName] = useState<string>('');
	const [customEntrypoint, setCustomEntrypoint] = useState<string>('');

	const toast = useToast({ duration: 2000, isClosable: true });
	const uploadProgram = async (oldProgram: IPCProgram | undefined) => {
		if (!fileEvent || !fileEvent.target.files) return;
		const filename = extractFilename(fileEvent.target.value);
		if (!filename) return;

		setIsDeployLoading(true);
		try {
			const upload = await user.computing.uploadProgram(
				{
					name: customName || filename,
					hash: '',
					createdAt: Date.now(),
					entrypoint: customEntrypoint || user.config?.defaultEntrypoint || 'main:app',
				},
				fileEvent.target.files[0],
				!!oldProgram,
				oldProgram,
			);
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
			setPrograms(user.computing.programs);
			onClose();
		} catch (error) {
			console.error(error);
			toast({ title: 'Unable to upload file', status: 'error' });
		}
		setFileEvent(undefined);
		setIsDeployLoading(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Deploy a program"
			CTA={
				<Button
					variant="inline"
					w="100%"
					mb="16px"
					onClick={() => uploadProgram(selectedProgram)}
					isLoading={isDeployLoading}
					id="ipc-dashboard-deploy-program-modal-button"
				>
					Deploy program
				</Button>
			}
		>
			<>
				<CustomProgram
					customName={customName}
					setCustomName={setCustomName}
					customEntrypoint={customEntrypoint}
					setCustomEntrypoint={setCustomEntrypoint}
				/>
				<Input
					type="file"
					h="100%"
					w="100%"
					p="10px"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
					id="ipc-dashboard-deploy-program"
				/>
			</>
		</Modal>
	);
};

export default ProgramModal;
