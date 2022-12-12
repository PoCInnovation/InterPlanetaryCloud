const matchingTables = {
	'jpg': 'Image JPG',
	'jpeg': 'Image JPEG',
	'png': 'Image PNG',
	'gif': 'Image GIF',
	'pdf': 'PDF file',
	'zip': 'ZIP file',
	'rar': 'RAR file',
	'7z': '7z file',
	'exe': 'EXE file',
	'html': 'HTML file',
	'js': 'JavaScript file',
	'css': 'CSS file',
	'json': 'JSON file',
	'xml': 'XML file',
	'csv': 'CSV file',
	'txt': 'Text file',
	'rtf': 'RTF file',
	'doc': 'Word file',
	'docx': 'Word file',
	'xls': 'Excel file',
	'xlsx': 'Excel file',
	'ppt': 'PowerPoint file',
	'pptx': 'PowerPoint file',
	'psd': 'Photoshop file',
	'indd': 'InDesign file',
	'ai': 'Illustrator file',
	'eps': 'EPS file',
	'ps': 'PS file',
	'wav': 'WAV file',
	'mp3': 'MP3 file',
	'ogg': 'OGG file',
	'flac': 'FLAC file',
	'wma': 'WMA file',
	'avi': 'AVI file',
	'mp4': 'MP4 file',
	'mov': 'MOV file',
	'wmv': 'WMV file',
	'flv': 'FLV file',
	'3gp': '3GP file',
	'apk': 'APK file',
	'ipa': 'IPA file',
	'jar': 'JAR file',
	'iso': 'ISO file',
}

const getFileType = (fileName: string): string => {
	const fileExtension = fileName.split('.').pop();
	if (fileExtension) {
		return matchingTables[fileExtension.toLowerCase() as keyof typeof matchingTables] || 'Unknown type';
	}
	return 'Unknown type';
}

export default getFileType