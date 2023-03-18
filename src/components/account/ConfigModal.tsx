import React, { ChangeEvent } from 'react';
import { Input, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';

import Button from 'components/Button';

const ConfigModal = ({
	isOpen,
	onClose,
	type,
	defaultValue,
	validate,
}: {
	isOpen: boolean;
	onClose: () => void;
	type: string;
	defaultValue?: string;
	validate: (name: string, setIsLoading: (loading: boolean) => void) => Promise<void>;
}): JSX.Element => {
	const [input, setInput] = React.useState<string>(defaultValue ?? '');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const isIdentical = input === defaultValue;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'Deploy a program'}
			CTA={
				<Button
					variant="primary"
					size="lg"
					onClick={() => validate(input, setIsLoading)}
					isLoading={isLoading}
					disabled={isIdentical}
					cursor={isIdentical ? 'not-allowed' : 'pointer'}
					id="ipc-dashboard-deploy-program-modal-button"
				>
					{`Change my ${type}`}
				</Button>
			}
		>
			<VStack spacing="16px" w="100%" align="start">
				<Input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
			</VStack>
		</Modal>
	);
};

export default ConfigModal;
