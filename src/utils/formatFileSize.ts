const formatFileSize = (size: number): string => {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

export default formatFileSize;
