import type { IPCFolder } from 'types/types';

export const formatPath = (path: string): string => {
	let result = path;
	if (!result.startsWith('/')) result = `/${result}`;
	if (!result.endsWith('/')) result = `${result}/`;
	return result;
};

export const isValidFolderPath = (path: string, folders: IPCFolder[]): boolean => {
	if (path === '/') return true;

	const found = folders.find((folder) => `${folder.path}${folder.name}/` === path);
	return found !== undefined;
};
