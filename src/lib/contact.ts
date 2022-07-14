import { accounts, aggregate } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType, AggregateMessage } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import type { IPCContact, IPCFile, ResponseType, AggregateType, AggregateContentType, IPCFolder } from 'types/types';
import { encryptWithPublicKey, decryptWithPrivateKey } from 'eth-crypto';

class Contact {
	public contacts: IPCContact[];

	private readonly account: accounts.base.Account | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.base.Account, private_key: string) {
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

	public async load(): Promise<ResponseType> {
		try {
			if (this.account) {
				const aggr = await aggregate.Get<AggregateType>({
					APIServer: DEFAULT_API_V2,
					address: this.account.address,
					keys: ['InterPlanetaryCloud'],
				});

				this.contacts = aggr.InterPlanetaryCloud.contacts;

				return { success: true, message: 'Contacts loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load contacts' };
		}
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

	public async updateFileContent(newFile: IPCFile, oldHash: string): Promise<ResponseType> {
		try {
			if (this.account) {
				await Promise.all(
					this.contacts.map(async (contact, i) => {
						const file = this.contacts[i].files.find((f) => f.hash === oldHash);

						if (file) {
							file.hash = newFile.hash;
							file.key = await encryptWithPublicKey(
								contact.publicKey.slice(2),
								await decryptWithPrivateKey(this.private_key, newFile.key),
							);
							await this.publishAggregate();
						}
					}),
				);
				return { success: true, message: 'File content updated' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update the file content' };
		}
	}

	public hasEditPermission(hash: string): ResponseType {
		try {
			if (this.account) {
				if (
					this.contacts.find((contact, index) => {
						if (this.account?.address === contact.address) {
							return this.contacts[index].files.find((file) => file.hash === hash);
						}
						return false;
					})
				) {
					return { success: true, message: 'You have edit permission' };
				}
				return { success: false, message: 'Failed to load account' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	public async updateFileName(concernedFile: IPCFile, newName: string): Promise<ResponseType> {
		try {
			for (let i = 0; this.contacts[i] != null; i += 1) {
				this.updateOneFileName(concernedFile.hash, newName, i);
			}
			return { success: true, message: 'Filename updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	private async updateOneFileName(fileHash: string, newName: string, contactIndex: number): Promise<ResponseType> {
		try {
			if (this.account) {
				const file = this.contacts[contactIndex].files.find((f) => f.hash === fileHash);
				if (file) {
					file.name = newName;
					await this.publishAggregate();
					return { success: true, message: 'Filename updated' };
				}
				return { success: false, message: 'File does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	public async addFileToContact(contactAddress: string, mainFile: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				if (
					await Promise.all(
						this.contacts.map(async (contact, index) => {
							if (contact.address === contactAddress) {
								if (this.contacts[index].files.find((file) => file.hash === mainFile.hash)) {
									return { success: false, message: 'The file is already shared' };
								}
								this.contacts[index].files.push({
									hash: mainFile.hash,
									key: await encryptWithPublicKey(
										contact.publicKey.slice(2),
										await decryptWithPrivateKey(this.private_key, mainFile.key),
									),
									created_at: mainFile.created_at,
									name: mainFile.name,
									path: mainFile.path,
								});
								await this.publishAggregate();
								return true;
							}
							return false;
						}),
					)
				)
					return { success: true, message: 'File shared with the contact' };
				return { success: false, message: 'Contact does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to share the file with the contact' };
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

	public async moveFile(file: IPCFile, newPath: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const contact = this.contacts.find((c) => c.address === this.account?.address);

				if (contact) {
					const currentFile = contact.files.find((f) => f.hash === file.hash);
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
}

export default Contact;
