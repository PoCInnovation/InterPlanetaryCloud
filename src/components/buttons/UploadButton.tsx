import React from 'react';

const UploadButton: React.FC = () => {
	const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(event);
	};

	return (
		<div>
			<input onChange={uploadFile} type="file" />
		</div>
	);
};

export default UploadButton;
