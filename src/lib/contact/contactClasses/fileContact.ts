import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, post } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';

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
import Contact from '../contact';

class ContactFile {

	public contacts: IPCContact[];
	
	public contact: Contact;

	public account: accounts.ethereum.ETHAccount;

	constructor(contactClass: Contact) {
		this.contacts = contactClass.contacts;
		this.contact = contactClass;
		this.account = contactClass.account;
		// this.contact.load();
	}
	
    public async updateFileName(concernedFile: IPCFile, newName: string, sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contacts.map(async (c) => {
					const file = c.files.find((f) => f.id === concernedFile.id);
					if (file) {
						file.name = newName;
						file.logs.push({
							action: `Renamed file to ${newName}`,
							date: Date.now(),
						});
						fileFound = true;
						await this.contact.publishAggregate();
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
						await this.contact.publishAggregate();
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

	public async deleteFiles(ids: string[], sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			ids.forEach(async (id) => {
				const me = this.contacts.find((c) => c.address === this.account.address)!;
				const file = me.files.find((f) => f.id === id);

				if (file) {
					me.files = me.files.filter((f) => f.id !== id);
				} else {
					const sharedFile = sharedFiles.find((f) => f.id === id);
					if (sharedFile) {
						post.Publish({
							account: this.account,
							postType: 'InterPlanetaryCloud',
							content: { file, tags: ['delete', id] },
							channel: 'TEST',
							storageEngine: ItemType.ipfs,
						});
					}
				}
			});
			this.contact.publishAggregate();
			return { success: true, message: 'File deleted from the contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the file from the contact' };
		}
	}

	public async moveFile(file: IPCFile, newPath: string): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === this.account.address);
			console.log(this.contacts);
			if (contact) {
				const currentFile = contact.files.find((f) => f.id === file.id);
				if (currentFile) {
					currentFile.path = newPath;
					currentFile.logs.push({
						action: `Moved file to ${newPath}`,
						date: Date.now(),
					});
					await this.contact.publishAggregate();
					return { success: true, message: 'File moved' };
				}
				return { success: false, message: 'File does not exist' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to move the file' };
		}
	}

	public async moveFileToBin(
		concernedFile: IPCFile,
		deletedAt: number | null,
		sharedFiles: IPCFile[],
	): Promise<ResponseType> {
		try {
			let fileFound = false;
			this.contacts.forEach(async (contact) => {
				const file = contact.files.find((f) => f.id === concernedFile.id);
				if (file) {
					file.deletedAt = deletedAt;
					file.logs.push({
						action: deletedAt ? 'Moved file to bin' : 'Restored file',
						date: Date.now(),
					});
					fileFound = true;
					await this.contact.publishAggregate();
				}
			});
			if (!fileFound) {
				const file = sharedFiles.find((f) => f.id === concernedFile.id);
				if (!file) {
					return { success: false, message: 'File not found' };
				}
				await post.Publish({
					account: this.account,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...concernedFile, deletedAt }, tags: ['bin', concernedFile.id] },
					channel: 'TEST',
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: `File ${deletedAt === null ? 'removed from' : 'moved to'} the bin` };
		} catch (err) {
			console.error(err);
			return {
				success: false,
				message: `Failed to ${deletedAt === null ? 'remove the file from' : 'move the file to'} the bin`,
			};
		}
	}
}

export default ContactFile;