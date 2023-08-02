import { FileInfo, FolderInfo } from '../types/types';

class FolderTree {
	folders: FolderInfo;

	files: FileInfo[];

	constructor(folders: FolderInfo, files: FileInfo[]) {
		this.folders = folders;
		this.files = files;
	}

	getFolderContent(filePath: string, fileSize: number) {
		const folders = filePath.split('/');
		const rootName = folders[0];
		const parentFolders = folders;
		const fileName = folders[folders.length - 1];
		parentFolders.pop();
		parentFolders.shift();

		let currentFolder = this.folders;
		let folderPath = '';

		parentFolders.forEach((folder) => {
			folderPath = folderPath.concat(folder, '/');
			const existingFolder = currentFolder.subFolder.find((item) => item.folderName === folder);

			if (existingFolder) {
				currentFolder = existingFolder;
			} else {
				const searchFinalFolder = folderPath.split('/');
				searchFinalFolder.pop();
				searchFinalFolder.pop();
				folderPath = '';
				searchFinalFolder.forEach((folderName) => {
					folderPath = folderPath.concat(folderName);
					folderPath = folderPath.concat('/');
				});
				const newFolder: FolderInfo = {
					folderName: folder,
					folderPath: `${rootName}/${folderPath}`,
					subFolder: [],
				};
				currentFolder.subFolder.push(newFolder);
				currentFolder = newFolder;
			}
		});
		const newFilePath = filePath.split('/');

		newFilePath.pop();

		let newPath = '';
		newFilePath.forEach((file) => {
			newPath = newPath.concat('/');
			newPath = newPath.concat(file);
		});

		const newFile: FileInfo = {
			fileName,
			filePath: newPath,
			fileSize,
		};
		this.files.push(newFile);
	}
}

export default FolderTree;
