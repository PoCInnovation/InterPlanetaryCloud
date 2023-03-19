import React, { ChangeEvent, useState } from 'react';
import { Input, VStack } from '@chakra-ui/react';

import Modal from 'components/Modal';

import Button from 'components/Button';
import {useUserContext} from "../../contexts/user";

const ConfigInputModal = ({
	isOpen,
	type,
	isLoading,
  	onClose,
  	onClick,
}: {
	isOpen: boolean;
	type: string;
	isLoading: boolean;
	onClose: () => void;
	onClick: (key: string, value: string) => Promise<void>;
}): JSX.Element => {
	const { user } = useUserContext();
	const optionConfig = user?.config![type];
	const [input, setInput] = useState<string>("");

	if (!optionConfig) {
		return <></>;
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'Configuration modfication'}
			CTA={
				<Button
					variant="primary"
					size="lg"
					onClick={() => {
						setInput("")
						onClick(type, input)
					}}
					isLoading={isLoading}
					disabled={input === ""}
					cursor={input === "" ? 'not-allowed' : 'pointer'}
					id="ipc-config-modal-button"
				>
					{`Change my ${optionConfig.name}`}
				</Button>
			}
		>
			<VStack spacing="16px" w="100%" align="start">
				<Input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
			</VStack>
		</Modal>
	);
};

export default ConfigInputModal;
