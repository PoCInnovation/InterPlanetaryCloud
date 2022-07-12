import node_path from 'path';
import _clone from 'git-clone';
import { GITCLONE_DIR } from 'config/constants';
import { createDir, fileExists, rmdir } from 'utils/fsPromise';
import { boolean } from 'joi';
import { useNumberInput } from '@chakra-ui/react';

function getRepoName(repoUrl: string): string {
	const pathArray = repoUrl.replace('.git', '').split('/');
	return pathArray[pathArray.length - 1];
}

function getRepoUsername(repoUrl: string): string {
	const pathArray = repoUrl.replace('.git', '').split('/');
	const usernameBase = pathArray[pathArray.length - 2];
	if (!usernameBase.includes('git@')) {
		return usernameBase;
	}
	return usernameBase.split(':')[1];
}

function getPath(repoUrl: string): string {
	const username = getRepoUsername(repoUrl);
	const repoName = getRepoName(repoUrl);
	return `${GITCLONE_DIR}/${username}@${repoName}`;
}

function cleanup(path: string): Promise<void> {
	return rmdir(path, { recursive: true });
}

async function clone(repoUrl: string): Promise<string> {
	if (!fileExists(GITCLONE_DIR)) {
		createDir(GITCLONE_DIR);
	}
	const path = getPath(repoUrl);
	await _clone(repoUrl, path);
	return node_path.resolve(path);
}

export { cleanup, clone };
