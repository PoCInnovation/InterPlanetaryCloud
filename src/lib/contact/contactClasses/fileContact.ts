import { aggregate, post } from 'aleph-sdk-ts/dist/messages';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';

import type { AggregateType, IPCFile, ResponseType } from 'types/types';

import Contact from '../contact';

class ContactFile {
	constructor(private contact: Contact) {}

	public async updateName(concernedFile: IPCFile, newName: string, sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contact.contacts.map(async (c) => {
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
					account: this.contact.account,
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

	public async getOwner(fileId: string): Promise<string | undefined> {
		let owner;
		await Promise.all(
			this.contact.contacts.map(async (contact) => {
				const aggr = await aggregate.Get<AggregateType>({
					address: contact.address,
					keys: ['InterPlanetaryCloud'],
				});
				const myContact = aggr.InterPlanetaryCloud.contacts.find((c) => c.address === this.contact.account.address);
				if (myContact?.files.find((f) => f.id === fileId)) {
					owner = contact.publicKey;
				}
			}),
		);
		return owner;
	}

	public async updateContent(newFile: IPCFile): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contact.contacts.map(async (contact) => {
					const file = contact.files.find((f) => f.id === newFile.id);

					if (file && this.contact.account) {
						file.hash = newFile.hash;
						file.encryptInfos = {
							key: (
								await this.contact.account.encrypt(
									await this.contact.account.decrypt(Buffer.from(newFile.encryptInfos.key, 'hex')),
									contact.publicKey,
								)
							).toString('hex'),
							iv: (
								await this.contact.account.encrypt(
									await this.contact.account.decrypt(Buffer.from(newFile.encryptInfos.iv, 'hex')),
									contact.publicKey,
								)
							).toString('hex'),
						};
						fileFound = true;
						await this.contact.publishAggregate();
					}
				}),
			);

			if (!fileFound && this.contact.account) {
				const owner = await this.getOwner(newFile.id);

				if (!owner) {
					return { success: false, message: 'File not found' };
				}
				// const fileKey = (
				// 	await this.account.encrypt(await this.account.decrypt(Buffer.from(newFile.encryptKey, 'hex')))
				// ).toString('hex');

				const encryptInfos = {
					key: (
						await this.contact.account.encrypt(
							await this.contact.account.decrypt(Buffer.from(newFile.encryptInfos.key, 'hex')),
							owner,
						)
					).toString('hex'),
					iv: (
						await this.contact.account.encrypt(
							await this.contact.account.decrypt(Buffer.from(newFile.encryptInfos.iv, 'hex')),
							owner,
						)
					).toString('hex'),
				};
				await post.Publish({
					account: this.contact.account,
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

	public async delete(ids: string[], sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			ids.forEach((id) => {
				const me = this.contact.contacts.find((c) => c.address === this.contact.account.address)!;
				const file = me.files.find((f) => f.id === id);

				if (file) {
					me.files = me.files.filter((f) => f.id !== id);
				} else {
					const sharedFile = sharedFiles.find((f) => f.id === id);
					if (sharedFile) {
						post.Publish({
							account: this.contact.account,
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

	public async move(file: IPCFile, newPath: string): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === this.contact.account.address);

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

	public async moveToBin(
		concernedFile: IPCFile,
		deletedAt: number | null,
		sharedFiles: IPCFile[],
	): Promise<ResponseType> {
		try {
			let fileFound = false;
			this.contact.contacts.forEach((contact) => {
				const file = contact.files.find((f) => f.id === concernedFile.id);
				if (file) {
					file.deletedAt = deletedAt;
					file.logs.push({
						action: deletedAt ? 'Moved file to bin' : 'Restored file',
						date: Date.now(),
					});
					fileFound = true;
				}
			});
			this.contact.publishAggregate();
			if (!fileFound) {
				const file = sharedFiles.find((f) => f.id === concernedFile.id);
				if (!file) {
					return { success: false, message: 'File not found' };
				}
				await post.Publish({
					account: this.contact.account,
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

	public async addToContact(contactAddress: string, mainFile: IPCFile): Promise<ResponseType> {
		try {
			const index = this.contact.contacts.findIndex((contact) => contact.address === contactAddress);
			let encryptInfosKey = mainFile.encryptInfos.key;
			let encryptInfosIv = mainFile.encryptInfos.iv;

			if (encryptInfosKey.slice(0, 2) === "0x") {
				encryptInfosKey = encryptInfosKey.slice(2);
			}
			if (encryptInfosIv.slice(0, 2) === "0x") {
				encryptInfosIv = encryptInfosIv.slice(2);
			}
			if (index !== -1) {
				if (this.contact.contacts[index].files.find((file) => file.id === mainFile.id)) {
					return { success: false, message: 'The file is already shared' };
				}
				const newFile: IPCFile = {
					...mainFile,
					logs: [
						...mainFile.logs,
						{
							action: `Shared file with ${this.contact.contacts[index].name}`,
							date: Date.now(),
						},
					],
					// encryptKey: (
					// 	await this.account.encrypt(
					// 		await this.account.decrypt(Buffer.from(mainFile.encryptKey, 'hex')),
					// 		this.contact.contacts[index].publicKey,
					// 	)
					// ).toString('hex'),
					encryptInfos: {
						key: (
							await this.contact.account.encrypt(
								await this.contact.account.decrypt(Buffer.from(encryptInfosKey, 'hex')),
								this.contact.contacts[index].publicKey,
							)
						).toString('hex'),
						iv: (
							await this.contact.account.encrypt(
								await this.contact.account.decrypt(Buffer.from(encryptInfosIv, 'hex')),
								this.contact.contacts[index].publicKey,
							)
						).toString('hex'),
					},
				};
				
				this.contact.contacts[index].files.push(newFile);
				this.contact.publishAggregate();
				return { success: true, message: 'File shared with the contact' };
			}
			return { success: false, message: 'Contact does not exist' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to share the file with the contact' };
		}
	}
}

export default ContactFile;
