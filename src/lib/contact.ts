import { accounts, aggregate } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import type { IPCContact, IPCFile, ResponseType, AggregateType } from 'types/types';
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

	private async publishAggregate() {
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
					address: this.account!.address,
					keys: ['InterPlanetaryCloud'],
				});

				this.contacts = aggr.InterPlanetaryCloud.contacts;

				return { success: true, message: 'Contacts loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
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
			console.log(err);
			return { success: false, message: 'Failed to add this contact' };
		}
	}

	public async remove(contactAddress: string): Promise<ResponseType> {
		try {
			if (this.account) {
				if (contactAddress !== this.account.address) {
					this.contacts.map((contact, index) => {
						if (contact.address === contactAddress) {
							this.contacts.splice(index, 1);
							return true;
						}
						return false;
					});

					await this.publishAggregate();
					return { success: true, message: 'Contact deleted' };
				}
				return { success: false, message: "You can't delete your account" };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to delete this contact' };
		}
	}

	public async update(contactAddress: string, newName: string): Promise<ResponseType> {
		try {
			if (this.account) {
				if (
					this.contacts.find((contact, index) => {
						if (contact.address === contactAddress) {
							this.contacts[index].name = newName;
							return true;
						}
						return false;
					})
				) {
					await this.publishAggregate();
					return { success: true, message: 'Contact updated' };
				}
				return { success: false, message: 'Contact does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to update this contact' };
		}
	}

	public async updateFileContent(newFile: IPCFile, oldHash: string): Promise<ResponseType> {
		try {
			if (this.account) {
				await Promise.all(
					this.contacts.map(async (contact, i) => {
						this.contacts[i].files.map(async (file, j) => {
							if (file.hash === oldHash) {
								this.contacts[i].files[j].hash = newFile.hash;
								this.contacts[i].files[j].key = await encryptWithPublicKey(
									contact.publicKey.slice(2),
									await decryptWithPrivateKey(this.private_key, newFile.key),
								);
								await this.publishAggregate();
							}
						});
					}),
				);
				return { success: true, message: 'File content updated' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to update the file content' };
		}
	}

	public async hasEditPermission(hash: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const owner = this.account.address;
				if (
					this.contacts.find((contact, index) => {
						if (owner === contact.address) {
							return this.contacts[index].files.find((file) => {
								if (file.hash === hash) return true;
								return false;
							});
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
			console.log(err);
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
			console.log(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	public async updateOneFileName(fileHash: string, newName: string, contactIndex: number): Promise<ResponseType> {
		try {
			if (this.account) {
				if (
					this.contacts[contactIndex].files.find((file, fileIndex) => {
						if (file.hash === fileHash) {
							this.contacts[contactIndex].files[fileIndex].name = newName;
							return true;
						}
						return false;
					})
				) {
					await this.publishAggregate();
					return { success: true, message: 'Filename updated' };
				}
				return { success: false, message: 'File does not exist' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}

	public async addFileToContact(contactAddress: string, mainFile: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				if (
					await Promise.all(
						this.contacts.map(async (contact, contactIndex) => {
							if (contact.address === contactAddress) {
								if (this.contacts[contactIndex].files.find((file) => file.hash === mainFile.hash)) {
									return { success: false, message: 'The file is already shared' };
								}
								this.contacts[contactIndex].files.push({
									hash: mainFile.hash,
									key: await encryptWithPublicKey(
										contact.publicKey.slice(2),
										await decryptWithPrivateKey(this.private_key, mainFile.key),
									),
									created_at: mainFile.created_at,
									name: mainFile.name,
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
			console.log(err);
			return { success: false, message: 'Failed to share the file with the contact' };
		}
	}
}

export default Contact;
