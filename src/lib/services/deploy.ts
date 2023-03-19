import { ethereum } from 'aleph-sdk-ts/dist/accounts';
import { program } from 'aleph-sdk-ts/dist/messages';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';
import fs from 'node:fs';

import child_process from 'child_process';

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
		file: fs.readFileSync(path),
		entrypoint,
	});
	return programHashPublishProgram.item_hash;
}

export { compress, programPublish };
