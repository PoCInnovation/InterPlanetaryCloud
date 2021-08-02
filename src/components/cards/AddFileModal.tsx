import React from 'react';

import Modal from '../layout/Modal';
import UploadButton from '../buttons/UploadButton';

type TAddFileModalProps = {
	// TODO: select a better type
	// eslint-disable-next-line @typescript-eslint/ban-types
	close: Function;
};

const AddFileModal: React.FC<TAddFileModalProps> = ({ close }: TAddFileModalProps) => (
	<Modal close={close} title="Upload a file">
		<div className="bg-gray-100 flex justify-center w-full p-2">
			<UploadButton />
		</div>
	</Modal>
);

export default AddFileModal;
