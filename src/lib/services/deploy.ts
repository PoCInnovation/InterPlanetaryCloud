import _zip from 'cross-zip';
import { promisify } from 'util';
import node_path from 'path';

const zip = promisify(_zip.zip);

function getOutputPath(path: string): string {
	return node_path.join(path, `${node_path.basename(path)}.zip`);
}

async function compress(path: string): Promise<void> {
	const out = getOutputPath(path);
	return zip(path, out);
}

export { compress };
