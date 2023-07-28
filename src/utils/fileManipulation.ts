export const extractFilename = (filepath: string): string => {
	const result = /[^\\]*$/.exec(filepath);
	return result?.length ? result[0] : '';
};

export const getFileContent = async (file: File | never[]): Promise<ArrayBuffer> => {
	try {
		if (file instanceof File) return await file.arrayBuffer();
		return new ArrayBuffer(0);
	} catch (error) {
		console.error(error);
		return new ArrayBuffer(0);
	}
};

export const getRootFolderName = (file: File): string => {
	const folderName = file.webkitRelativePath.split('/')[0];

	if (folderName && folderName.length > 0) return folderName;
	return '';
};
