import { ChangeEvent, useState } from 'react';
import { Input, Text, useColorModeValue, useToast, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';

import { useUserContext } from 'contexts/user';
import { useDriveContext } from 'contexts/drive';

import { extractFilename } from 'utils/fileManipulation';

import { IPCProgram } from 'types/types';

import Button from 'components/Button';

import { textColorMode } from 'config/colorMode';

import CustomProgram from '../CustomProgram';

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
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

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
			const upload = await user.fullContact.computing.upload(
				{
					id: crypto.randomUUID(),
					name: customName || filename,
					hash: '',
					createdAt: Date.now(),
					entrypoint: customEntrypoint || user.config?.defaultEntrypoint.value || 'main:app',
					permission: 'owner',
					size: fileEvent.target.files[0].size,
					logs: [
						{
							action: 'Program created',
							date: Date.now(),
						},
					]
				},
				fileEvent.target.files[0],
				!!oldProgram,
				oldProgram,
			);
			toast({ title: upload.message, status: upload.success ? 'success' : 'error' });
			setPrograms(user.fullContact.computing.programs);
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
			title={selectedProgram ? 'Redeploy a program' : 'Deploy a program'}
			CTA={
				<Button
					variant="primary"
					size="lg"
					onClick={() => uploadProgram(selectedProgram)}
					isLoading={isDeployLoading}
					id="ipc-dashboard-deploy-program-modal-button"
				>
					{selectedProgram ? 'Redeploy the program' : 'Deploy a program'}
				</Button>
			}
		>
			<VStack spacing="16px" w="100%" align="start">
				<CustomProgram
					customName={customName}
					setCustomName={setCustomName}
					customEntrypoint={customEntrypoint}
					setCustomEntrypoint={setCustomEntrypoint}
				/>
				<VStack spacing="8px" align="start" w="100%">
					<Text size="boldLg" color={textColor}>
						The file of the program
					</Text>
					<Input
						type="file"
						h="100%"
						w="100%"
						p="10px"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
						id="ipc-dashboard-deploy-program-modal"
					/>
				</VStack>
			</VStack>
		</Modal>
	);
};

export default ProgramModal;
