import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, post } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';
import Contact from 'lib/contact/contact';

import type {
	AggregateContentType,
	AggregateType,
	IPCContact,
	IPCFile,
	IPCFolder,
	IPCUpdateContent,
	ResponseType,
} from 'types/types';

import { ALEPH_CHANNEL } from 'config/constants';

class ContactFile extends Contact {

    public async updateFileName(concernedFile: IPCFile, newName: string, sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contacts.map(async (contact) => {
					const file = contact.files.find((f) => f.id === concernedFile.id);
					if (file) {
						file.name = newName;
						file.logs.push({
							action: `Renamed file to ${newName}`,
							date: Date.now(),
						});
						fileFound = true;
						await this.publishAggregate();
					}
				}),
			);
			if (!fileFound) {
				const file = sharedFiles.find((f) => f.id === concernedFile.id);
				if (!file) {
					return { success: false, message: 'File not found' };
				}
				await post.Publish({
					account: this.account,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...concernedFile, name: newName }, tags: ['rename', concernedFile.id] },
					channel: 'TEST',
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: 'Filename updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

    public async getFileOwner(fileId: string): Promise<string | undefined> {
        console.log(this.contacts);
		let owner;
		await Promise.all(
			this.contacts.map(async (contact) => {
				const aggr = await aggregate.Get<AggregateType>({
					address: contact.address,
					keys: ['InterPlanetaryCloud'],
				});
				const myContact = aggr.InterPlanetaryCloud.contacts.find((c) => c.address === this.account.address);
				if (myContact?.files.find((f) => f.id === fileId)) {
					owner = contact.publicKey;
				}
			}),
		);
        console.log("ALLALAL");
		return owner;
	}

    public async updateFileContent(newFile: IPCFile): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contacts.map(async (contact) => {
					const file = contact.files.find((f) => f.id === newFile.id);

					if (file && this.account) {
						file.hash = newFile.hash;
						file.encryptInfos = {
							key: (
								await this.account.encrypt(
									await this.account.decrypt(Buffer.from(newFile.encryptInfos.key, 'hex')),
									contact.publicKey,
								)
							).toString('hex'),
							iv: (
								await this.account.encrypt(
									await this.account.decrypt(Buffer.from(newFile.encryptInfos.iv, 'hex')),
									contact.publicKey,
								)
							).toString('hex'),
						};
						fileFound = true;
						await this.publishAggregate();
					}
				}),
			);

			if (!fileFound && this.account) {
				const owner = await this.getFileOwner(newFile.id);

				if (!owner) {
					return { success: false, message: 'File not found' };
				}
				// const fileKey = (
				// 	await this.account.encrypt(await this.account.decrypt(Buffer.from(newFile.encryptKey, 'hex')))
				// ).toString('hex');

				const encryptInfos = {
					key: (
						await this.account.encrypt(await this.account.decrypt(Buffer.from(newFile.encryptInfos.key, 'hex')), owner)
					).toString('hex'),
					iv: (
						await this.account.encrypt(await this.account.decrypt(Buffer.from(newFile.encryptInfos.iv, 'hex')), owner)
					).toString('hex'),
				};
				await post.Publish({
					account: this.account,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...newFile, encryptInfos }, tags: ['update', newFile.id] },
					channel: 'TEST',
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: 'File content updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update the file content' };
		}
	}
}

export default ContactFile;