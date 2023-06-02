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

class Contact {
	public contacts: IPCContact[];

	public username: string;

	public account: accounts.ethereum.ETHAccount;

	constructor(importedAccount: accounts.ethereum.ETHAccount) {
		this.contacts = [];
		this.account = importedAccount;
		this.username = '';
	}

	public async publishAggregate(): Promise<AggregateMessage<AggregateContentType>> {
		const aggr = await aggregate.Get<AggregateType>({
			address: this.account.address,
			keys: ['InterPlanetaryCloud'],
		});

		const content = aggr.InterPlanetaryCloud;
		content.contacts = this.contacts;

		return aggregate.Publish({
			channel: ALEPH_CHANNEL,
			storageEngine: ItemType.ipfs,
			account: this.account,
			key: 'InterPlanetaryCloud',
			content,
		});
	}

	public async load(): Promise<ResponseType> {
		try {
			const aggr = await aggregate.Get<AggregateType>({
				address: this.account.address,
				keys: ['InterPlanetaryCloud'],
			});

			this.contacts = aggr.InterPlanetaryCloud.contacts;
			this.username = this.contacts.find((c) => c.address === this.account.address)?.name || '';

			await this.loadUpdates();

			return { success: true, message: 'Contacts loaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load contacts' };
		}
	}

	private async loadUpdates(): Promise<void> {
		try {
			await Promise.all(
				this.contacts.map(async (contact) => {
					const updatableIds = contact.files.filter((file) => file.permission === 'editor').map((file) => file.id);

					const updates = await post.Get({
						types: ['InterPlanetaryCloud'],
						pagination: 200,
						addresses: [contact.address],
						tags: updatableIds,
					});
					await Promise.all(
						updates.posts.map(async (update) => {
							const { tags, file } = <IPCUpdateContent>update.content;
							const [type, fileId] = tags;
							await Promise.all(
								this.contacts.map(async (c) => {
									const foundFile = c.files.find((f) => f.id === fileId);

									if (foundFile && this.account) {
										if (type === 'rename') foundFile.name = file.name;
										else if (type === 'update') {
											foundFile.hash = file.hash;
											foundFile.size = file.size;
											foundFile.encryptInfos = {
												key: (
													await this.account.encrypt(
														await this.account.decrypt(Buffer.from(file.encryptInfos.key, 'hex')),
														c.publicKey,
													)
												).toString('hex'),
												iv: (
													await this.account.encrypt(
														await this.account.decrypt(Buffer.from(file.encryptInfos.iv, 'hex')),
														c.publicKey,
													)
												).toString('hex'),
											};
										} else if (type === 'delete') {
											const owner = this.contacts.find((co) => co.address === c.address)!;
											owner.files = owner.files.filter((f) => f.id !== fileId);
										} else if (type === 'bin') foundFile.deletedAt = file.deletedAt;
									}
								}),
							);
						}),
					);
					await this.publishAggregate();

					const hashes = updates.posts.map((p) => p.hash);
					await forget.Publish({
						account: this.account,
						channel: ALEPH_CHANNEL,
						storageEngine: ItemType.ipfs,
						hashes,
					});
				}),
			);
		} catch (err) {
			console.error(err);
		}
	}

	public async add(contactToAdd: IPCContact): Promise<ResponseType> {
		try {
			if (this.contacts.find((contact) => contact.address === contactToAdd.address)) {
				return { success: false, message: 'Contact already exist' };
			}
			this.contacts.push(contactToAdd);

			await this.publishAggregate();
			return { success: true, message: 'Contact added' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to add this contact' };
		}
	}

	public async remove(contactAddress: string): Promise<ResponseType> {
		try {
			if (contactAddress !== this.account.address) {
				this.contacts.forEach((contact, index) => {
					if (contact.address === contactAddress) {
						this.contacts.splice(index, 1);
					}
				});

				await this.publishAggregate();
				return { success: true, message: 'Contact deleted' };
			}
			return { success: false, message: "You can't delete your account" };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete this contact' };
		}
	}

	public async update(contactAddress: string, newName: string): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === contactAddress);

			if (contact) {
				contact.name = newName;
				await this.publishAggregate();
				return { success: true, message: 'Contact updated' };
			}
			return { success: false, message: 'Contact does not exist' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this contact' };
		}
	}

	public async addFileToContact(contactAddress: string, mainFile: IPCFile): Promise<ResponseType> {
		try {
			const index = this.contacts.findIndex((contact) => contact.address === contactAddress);

			if (index !== -1) {
				if (this.contacts[index].files.find((file) => file.id === mainFile.id)) {
					return { success: false, message: 'The file is already shared' };
				}
				const newFile: IPCFile = {
					...mainFile,
					logs: [
						...mainFile.logs,
						{
							action: `Shared file with ${this.contacts[index].name}`,
							date: Date.now(),
						},
					],
					// encryptKey: (
					// 	await this.account.encrypt(
					// 		await this.account.decrypt(Buffer.from(mainFile.encryptKey, 'hex')),
					// 		this.contacts[index].publicKey,
					// 	)
					// ).toString('hex'),
					encryptInfos: {
						key: (
							await this.account.encrypt(
								await this.account.decrypt(Buffer.from(mainFile.encryptInfos.key, 'hex')),
								this.contacts[index].publicKey,
							)
						).toString('hex'),
						iv: (
							await this.account.encrypt(
								await this.account.decrypt(Buffer.from(mainFile.encryptInfos.iv, 'hex')),
								this.contacts[index].publicKey,
							)
						).toString('hex'),
					},
				};

				this.contacts[index].files.push(newFile);
				this.publishAggregate();
				return { success: true, message: 'File shared with the contact' };
			}
			return { success: false, message: 'Contact does not exist' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to share the file with the contact' };
		}
	}

	public async createFolder(folder: IPCFolder): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === this.account.address);

			if (contact) {
				contact.folders.push(folder);
				await this.publishAggregate();
				return { success: true, message: 'Folder created' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async moveFolder(folder: IPCFolder, newPath: string): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === this.account.address);
			const fullPath = `${folder.path}${folder.name}/`;

			if (contact) {
				contact.folders = contact.folders.map((f) => {
					if (f.path.startsWith(fullPath))
						return {
							...f,
							path: f.path.replace(folder.path, newPath),
							logs: [
								...f.logs,
								{
									action: `Moved folder to ${fullPath}`,
									date: Date.now(),
								},
							],
						};
					if (f === folder) return { ...f, path: newPath };
					return f;
				});
				contact.files = contact.files.map((f) => {
					if (f.path.startsWith(fullPath)) return { ...f, path: f.path.replace(folder.path, newPath) };
					return f;
				});

				await this.publishAggregate();
				return { success: true, message: 'Folder created' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async deleteFolder(folder: IPCFolder): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === this.account.address);

			if (contact) {
				const fullPath = `${folder.path}${folder.name}/`;
				contact.folders = contact.folders.filter(
					(f) => !f.path.startsWith(fullPath) && (f.path !== folder.path || f.createdAt !== folder.createdAt),
				);

				await this.publishAggregate();

				return { success: true, message: 'Folder deleted' };
			}
			return { success: false, message: 'Failed to find your contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the folder' };
		}
	}


	public async updateConfig(key: string, value: string): Promise<ResponseType> {
		try {
			const contact = this.contacts.find((c) => c.address === this.account.address);
			if (contact?.config) {
				if (!contact.config[key]) {
					return { success: false, message: 'Invalid config key' };
				}
				contact.config[key].value = value;
				await this.publishAggregate();
				return { success: true, message: `${contact.config[key].name} changed` };
			}
			return { success: false, message: 'Failed to find account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to change name' };
		}
	}
}

export default Contact;
