import { ethereum } from 'aleph-sdk-ts/dist/accounts';
import { program } from 'aleph-sdk-ts/dist/messages';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';
import fs from 'node:fs';

import child_process from 'child_process';

import { ALEPH_CHANNEL } from 'config/constants';
import { cleanup } from './git';

const compress = (path: string) => {
	child_process.execSync(`zip -r ${path} *`, { cwd: path });
	return `${path}.zip`;
};

const programPublish = async (path: string, entrypoint: string) => {
	const programHashPublishProgram = await program.publish({
		channel: ALEPH_CHANNEL,
		account: ethereum.NewAccount().account,
		storageEngine: ItemType.storage,
		file: fs.readFileSync(path),
		entrypoint,
	});
	return programHashPublishProgram.item_hash;
};

const deploy = async (path: string, entrypoint: string) => {
	const fileName: string = compress(path);
	const itemHash = await programPublish(fileName, entrypoint);
	await cleanup(path);
	return itemHash;
};

export default deploy;
