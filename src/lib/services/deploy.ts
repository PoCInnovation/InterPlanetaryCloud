import _zip from 'cross-zip';
import { promisify } from 'util';
import node_path from 'path';
import { ALEPH_CHANNEL } from 'config/constants';
import { program } from 'aleph-sdk-ts';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ethereum } from 'aleph-sdk-ts/accounts';
import fs from 'fs';

const zip = promisify(_zip.zip);

function getOutputPath(path: string): string {
	return node_path.join(path, `${node_path.basename(path)}.zip`);
}

async function compress(path: string): Promise<string> {
	const out = getOutputPath(path);
	await zip(path, out);
	return out;
}

async function programPublish(path: string) {
	const programHashPublishProgram = await program.publish({
		channel: ALEPH_CHANNEL,
		account: ethereum.NewAccount().account,
		storageEngine: ItemType.storage,
		inlineRequested: true,
		APIServer: DEFAULT_API_V2,
		file: fs.readFileSync(path),
		entrypoint: `main:app`,
	});
	console.log(programHashPublishProgram);
}

export { compress, programPublish };
