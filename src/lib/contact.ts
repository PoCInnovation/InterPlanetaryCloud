import { accounts, aggregate, forget, post } from 'aleph-sdk-ts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/messages/message';
import { decryptWithPrivateKey, encryptWithPublicKey } from 'eth-crypto';

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

	private readonly account: accounts.ethereum.ETHAccount | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.ethereum.ETHAccount, private_key: string) {
		this.contacts = [];
		this.account = importedAccount;
		this.private_key = private_key;
	}

	private async publishAggregate(): Promise<AggregateMessage<AggregateContentType>> {
		const aggr = await aggregate.Get<AggregateType>({
			APIServer: DEFAULT_API_V2,
			address: this.account!.address,
			keys: ['InterPlanetaryCloud'],
		});

		const content = aggr.InterPlanetaryCloud;
		content.contacts = this.contacts;

		return aggregate.Publish({
			APIServer: DEFAULT_API_V2,
			channel: ALEPH_CHANNEL,
			inlineRequested: true,
			storageEngine: ItemType.ipfs,
			account: this.account!,
			key: 'InterPlanetaryCloud',
			content,
		});
	}

	private async getFileOwner(fileId: string): Promise<string | undefined> {
		let owner;
		await Promise.all(
			this.contacts.map(async (contact) => {
				const aggr = await aggregate.Get<AggregateType>({
					APIServer: DEFAULT_API_V2,
					address: contact.address,
					keys: ['InterPlanetaryCloud'],
				});

				const myContact = aggr.InterPlanetaryCloud.contacts.find((c) => c.address === this.account!.address);
				if (myContact?.files.find((f) => f.id === fileId)) {
					owner = contact.publicKey;
				}
			}),
		);
		return owner;
	}

	public async load(): Promise<ResponseType> {
		try {
			if (this.account) {
				const aggr = await aggregate.Get<AggregateType>({
					APIServer: DEFAULT_API_V2,
					address: this.account.address,
					keys: ['InterPlanetaryCloud'],
				});

				this.contacts = aggr.InterPlanetaryCloud.contacts;

				await this.loadUpdates();

				return { success: true, message: 'Contacts loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load contacts' };
		}
	}

	private async loadUpdates() {
		this.contacts.forEach(async (contact) => {
			const updatableIds = contact.files.filter((file) => file.permission === 'editor').map((file) => file.id);
			const updates = await post.Get({
				APIServer: DEFAULT_API_V2,
				types: ['InterPlanetaryCloud'],
				pagination: 200,
				page: 1,
				refs: [],
				addresses: [contact.address],
				tags: updatableIds,
				hashes: [],
			});
			updates.posts.forEach(async (update) => {
				const { tags, file } = <IPCUpdateContent>update.content;
				const [type, fileId] = tags;

				this.contacts.forEach(async (c) => {
					const foundFile = c.files.find((f) => f.id === fileId);

					if (foundFile) {
						if (type === 'rename') {
							foundFile.name = file.name;
						} else if (type === 'update') {
							foundFile.hash = file.hash;
							foundFile.size = file.size;
							const newKey = await encryptWithPublicKey(
								c.publicKey.slice(2),
								await decryptWithPrivateKey(this.private_key, file.key),
							);
							foundFile.key = { ...newKey };
						} else if (type === 'delete') {
							const owner = this.contacts.find((co) => co.address === c.address)!;
							owner.files = owner.files.filter((f) => f.id !== fileId);
						}
					}
				});
			});

			await this.publishAggregate();

			const hashes = updates.posts.map((p) => p.hash);
			await forget.publish({
				account: this.account!,
				channel: ALEPH_CHANNEL,
				storageEngine: ItemType.ipfs,
				inlineRequested: true,
				APIServer: DEFAULT_API_V2,
				hashes,
			});
		});
	}

	public async add(contactToAdd: IPCContact): Promise<ResponseType> {
		try {
			if (this.account) {
				if (this.contacts.find((contact) => contact.address === contactToAdd.address)) {
					return { success: false, message: 'Contact already exist' };
				}
				this.contacts.push(contactToAdd);

				await this.publishAggregate();
				return { success: true, message: 'Contact added' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to add this contact' };
		}
	}

	public async remove(contactAddress: string): Promise<ResponseType> {
		try {
			if (this.account) {
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
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete this contact' };
		}
	}

	public async update(contactAddress: string, newName: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === contactAddress);

				if (contact) {
					contact.name = newName;
					await this.publishAggregate();
					return { success: true, message: 'Contact updated' };
				}
				return { success: false, message: 'Contact does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this contact' };
		}
	}

	public async updateFileContent(newFile: IPCFile): Promise<ResponseType> {
		try {
			let fileFound = false;
			this.contacts.forEach(async (contact, i) => {
				const file = this.contacts[i].files.find((f) => f.id === newFile.id);

				if (file) {
					file.hash = newFile.hash;
					file.key = await encryptWithPublicKey(
						contact.publicKey.slice(2),
						await decryptWithPrivateKey(this.private_key, newFile.key),
					);
					fileFound = true;
					await this.publishAggregate();
				}
			});

			if (!fileFound) {
				const owner = await this.getFileOwner(newFile.id);
				if (!owner) {
					return { success: false, message: 'File not found' };
				}
				const fileKey = await encryptWithPublicKey(
					owner.slice(2),
					await decryptWithPrivateKey(this.private_key, newFile.key),
				);
				await post.Publish({
					account: this.account!,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...newFile, key: fileKey }, tags: ['update', newFile.id] },
					channel: 'TEST',
					APIServer: DEFAULT_API_V2,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: 'File content updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update the file content' };
		}
	}

	public async updateFileName(concernedFile: IPCFile, newName: string, sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			let fileFound = false;
			this.contacts.forEach(async (contact) => {
				const file = contact.files.find((f) => f.id === concernedFile.id);

				if (file) {
					file.name = newName;
					fileFound = true;
					await this.publishAggregate();
				}
			});
			if (!fileFound) {
				const file = sharedFiles.find((f) => f.id === concernedFile.id);
				if (!file) {
					return { success: false, message: 'File not found' };
				}
				await post.Publish({
					account: this.account!,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...concernedFile, name: newName }, tags: ['rename', concernedFile.id] },
					channel: 'TEST',
					APIServer: DEFAULT_API_V2,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: 'Filename updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	public async addFileToContact(contactAddress: string, mainFile: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				const index = this.contacts.findIndex((contact) => contact.address === contactAddress);

				if (index !== -1) {
					if (this.contacts[index].files.find((file) => file.id === mainFile.id)) {
						return { success: false, message: 'The file is already shared' };
					}
					const newFile: IPCFile = {
						...mainFile,
						key: await encryptWithPublicKey(
							this.contacts[index].publicKey.slice(2),
							await decryptWithPrivateKey(this.private_key, mainFile.key),
						),
					};

					this.contacts[index].files.push(newFile);
					this.publishAggregate();
					return { success: true, message: 'File shared with the contact' };
				}
				return { success: false, message: 'Contact does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to share the file with the contact' };
		}
	}

	public async deleteFiles(ids: string[], sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			ids.forEach(async (id) => {
				const me = this.contacts.find((c) => c.address === this.account?.address)!;
				const file = me.files.find((f) => f.id === id);

				if (file) {
					me.files = me.files.filter((f) => f.id !== id);
				} else {
					const sharedFile = sharedFiles.find((f) => f.id === id);
					if (sharedFile) {
						post.Publish({
							account: this.account!,
							postType: 'InterPlanetaryCloud',
							content: { file, tags: ['delete', id] },
							channel: 'TEST',
							APIServer: DEFAULT_API_V2,
							inlineRequested: true,
							storageEngine: ItemType.ipfs,
						});
					}
				}
			});
			this.publishAggregate();
			return { success: true, message: 'File deleted from the contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the file from the contact' };
		}
	}

	public async createFolder(folder: IPCFolder): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);

				if (contact) {
					contact.folders.push(folder);
					await this.publishAggregate();
					return { success: true, message: 'Folder created' };
				}
				return { success: false, message: 'Failed to load contact' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async moveFolder(folder: IPCFolder, newPath: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);
				const fullPath = `${folder.path}${folder.name}/`;

				if (contact) {
					contact.folders = contact.folders.map((f) => {
						if (f.path.startsWith(fullPath)) return { ...f, path: f.path.replace(folder.path, newPath) };
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
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async deleteFolder(folder: IPCFolder): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);

				if (contact) {
					const fullPath = `${folder.path}${folder.name}/`;
					contact.folders = contact.folders.filter(
						(f) => !f.path.startsWith(fullPath) && (f.path !== folder.path || f.createdAt !== folder.createdAt),
					);

					await this.publishAggregate();

					return { success: true, message: 'Folder deleted' };
				}
				return { success: false, message: 'Failed to find your contact' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the folder' };
		}
	}

	public async moveFile(file: IPCFile, newPath: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);

				if (contact) {
					const currentFile = contact.files.find((f) => f.id === file.id);
					if (currentFile) {
						currentFile.path = newPath;
						await this.publishAggregate();
						return { success: true, message: 'File moved' };
					}
					return { success: false, message: 'File does not exist' };
				}
				return { success: false, message: 'Failed to load contact' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to move the file' };
		}
	}

	public async configFile(newTheme: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);
				if (contact) {
					contact.config.theme = newTheme;
					await this.publishAggregate();
					return { success: true, message: 'Theme change' };
				}
				return { success: false, message: 'Theme does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to change theme' };
		}
	}
}

export default Contact;
