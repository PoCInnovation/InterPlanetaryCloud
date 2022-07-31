export const extractFilename = (filepath: string): string => {
	const result = /[^\\]*$/.exec(filepath);
	return result && result.length ? result[0] : '';
};

export const getFileContent = async (file: unknown): Promise<string> => {
	try {
		return await (file as Blob).text();
	} catch (error) {
		return '';
	}
};
