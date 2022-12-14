import { program } from 'aleph-sdk-ts/dist/messages';
import { ethereum } from 'aleph-sdk-ts/dist/accounts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/dist/global';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';

import child_process from 'child_process';

import fs from 'fs';

import { ALEPH_CHANNEL } from 'config/constants';

async function compress(path: string): Promise<string> {
	child_process.execSync(`zip -r ${path} *`, { cwd: path });
	return `${path}.zip`;
}

async function programPublish(path: string, entrypoint: string): Promise<string> {
	const programHashPublishProgram = await program.publish({
		channel: ALEPH_CHANNEL,
		account: ethereum.NewAccount().account,
		storageEngine: ItemType.storage,
		inlineRequested: true,
		APIServer: DEFAULT_API_V2,
		file: fs.readFileSync(path),
		entrypoint,
	});
	return programHashPublishProgram.item_hash;
}

export { compress, programPublish };
