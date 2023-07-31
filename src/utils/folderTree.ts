import { FileInfo, FolderInfo } from '../types/types';

class FolderTree {
	folders: FolderInfo;

	files: FileInfo[];

	constructor(folders: FolderInfo, files: FileInfo[]) {
		this.folders = folders;
		this.files = files;
	}

	getFolderContent(filePath: string) {
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
				const newFolder: FolderInfo = {
					folderName: folder,
					folderPath: `${rootName}/${folderPath}`,
					subFolder: [],
				};
				currentFolder.subFolder.push(newFolder);
				currentFolder = newFolder;
			}
		});
		const newFile: FileInfo = {
			fileName,
			filePath: `${rootName}/${filePath}`,
		};
		this.files.push(newFile);
	}
}

export default FolderTree;
