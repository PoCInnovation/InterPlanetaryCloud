const formatFileSize = (size: number): string => {
	if (size === 0) return `0B`;
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

export default formatFileSize;
