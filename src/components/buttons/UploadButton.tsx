import React from 'react';

const UploadButton: React.FC = () => {
	// eslint-disable-next-line
	const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {};

	return (
		<div>
			<input onChange={uploadFile} type="file" />
		</div>
	);
};

export default UploadButton;
