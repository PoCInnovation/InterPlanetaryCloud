// TODO: add type to button
/* eslint-disable react/button-has-type */
import React from 'react';
import Clipboard from 'react-clipboard.js';
import { StarIcon } from '@heroicons/react/solid';
import { CloudDownloadIcon } from '@heroicons/react/outline';

import { IPCFile } from 'types/file';

type TFileCardProps = {
	file: IPCFile;
};

const FileCard: React.FC<TFileCardProps> = ({ file }: TFileCardProps) => {
	const addFileToFavorites = () => {};

	const downloadFile = () => {};

	if (file.password) return <div />;
	return (
		<div className="border-gray-200 bg-white p-4 shadow rounded cursor-pointer">
			<p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100%]">{file.name}</p>
			<p className="text-sm text-gray-700">{new Date(file.created_at).toDateString()}</p>
			<div>
				<button
					className="group rounded-full p-[6px] border border-gray-300 bg-gray-100 hover:bg-gray-200 mr-2 mt-4"
					onClick={addFileToFavorites}
				>
					<StarIcon className="h-5 w-5 text-gray-400 group-hover:text-yellow-500" />
				</button>
				<Clipboard data-clipboard-text={file.content}>
					<button
						className="group rounded-full p-[6px] border border-gray-300 bg-gray-100 hover:bg-gray-200 mr-4 mt-2"
						onClick={downloadFile}
					>
						<CloudDownloadIcon className="h-5 w-5 text-blue-600" />
					</button>
				</Clipboard>
			</div>
		</div>
	);
};

export default FileCard;
