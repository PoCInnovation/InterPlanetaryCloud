import node_path from 'path';
import _clone from 'git-clone';
import { GITCLONE_DIR } from 'config/constants';
import { createDir, fileExists, rmdir } from 'utils/fsPromise';

function getRepoName(repoUrl: string): string {
	const path = repoUrl.replace('.git', '');
	return node_path.basename(path);
}

function getRepoUsername(repoUrl: string): string {
	const pathArray = repoUrl.replace('.git', '').split('/');
	const usernameBase = pathArray[pathArray.length - 2];
	if (!usernameBase.includes('git@')) {
		return usernameBase;
	}
	return usernameBase.split(':')[1];
}

function getProgramName(repoUrl: string): string {
	return `${getRepoUsername(repoUrl)}@${getRepoName(repoUrl)}`;
}

function getPath(repoUrl: string): string {
	return node_path.join(GITCLONE_DIR, `${getProgramName(repoUrl)}`);
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

export { cleanup, clone, getProgramName };
