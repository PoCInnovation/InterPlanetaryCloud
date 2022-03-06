import { accounts, post } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import { IPCContact, IPCFileContact, ResponseType } from 'types/types';

class Contact {
	public contacts: IPCContact[];

	public contactsPostHash: string;

	private readonly account: accounts.base.Account | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.base.Account, private_key: string) {
		this.contacts = [];
		this.contactsPostHash = '';
		this.account = importedAccount;
		this.private_key = private_key;
	}

	public async load(): Promise<ResponseType> {
		try {
			if (this.account) {
				const userData = await post.Get({
					APIServer: DEFAULT_API_V2,
					types: '',
					pagination: 200,
					page: 1,
					refs: [],
					addresses: [this.account.address],
					tags: [],
					hashes: [],
				});

				userData.posts.map((postContent) => {
					const itemContent = JSON.parse(postContent.item_content);
					if (itemContent.content.header === 'InterPlanetaryCloud2.0 - Contacts') {
						this.contactsPostHash = postContent.hash;
						if (itemContent.content.contacts.length > 0) {
							itemContent.content.contacts.map((contact: IPCContact) => {
								this.contacts.push(contact);
								return true;
							});
						}
						return true;
					}
					return false;
				});

				if (this.contactsPostHash === '') {
					console.log('Create Post Message for Contacts');
					this.contacts.push({
						name: 'Owner (Me)',
						address: this.account.address,
						publicKey: this.account.publicKey,
						files: [],
					});
					const newPostPublishResponse = await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: ALEPH_CHANNEL,
						inlineRequested: true,
						storageEngine: ItemType.ipfs,
						account: this.account,
						postType: '',
						content: {
							header: 'InterPlanetaryCloud2.0 - Contacts',
							contacts: this.contacts,
						},
					});
					this.contactsPostHash = newPostPublishResponse.item_hash;
				}
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

				await post.Publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
					postType: 'amend',
					content: {
						header: 'InterPlanetaryCloud2.0 - Contacts',
						contacts: this.contacts,
					},
					ref: this.contactsPostHash,
				});
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
				this.contacts.map((contact, index) => {
					if (contact.address === contactAddress) {
						this.contacts.splice(index, 1);
						return true;
					}
					return false;
				});

				await post.Publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
					postType: 'amend',
					content: {
						header: 'InterPlanetaryCloud2.0 - Contacts',
						contacts: this.contacts,
					},
					ref: this.contactsPostHash,
				});
				return { success: true, message: 'Contact deleted' };
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
					await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: ALEPH_CHANNEL,
						inlineRequested: true,
						storageEngine: ItemType.ipfs,
						account: this.account,
						postType: 'amend',
						content: {
							header: 'InterPlanetaryCloud2.0 - Contacts',
							contacts: this.contacts,
						},
						ref: this.contactsPostHash,
					});
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

	public async addFileToContact(contactAddress: string, fileInfos: IPCFileContact): Promise<ResponseType> {
		try {
			if (this.account) {
				if (
					this.contacts.find((contact, contactIndex) => {
						if (contact.address === contactAddress) {
							if (this.contacts[contactIndex].files.find((file) => file === fileInfos)) {
								return { success: false, message: 'The file is already shared' };
							}
							this.contacts[contactIndex].files.push(fileInfos);
							return true;
						}
						return false;
					})
				) {
					await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: ALEPH_CHANNEL,
						inlineRequested: true,
						storageEngine: ItemType.ipfs,
						account: this.account,
						postType: 'amend',
						content: {
							header: 'InterPlanetaryCloud2.0 - Contacts',
							contacts: this.contacts,
						},
						ref: this.contactsPostHash,
					});
					return { success: true, message: 'File shared with the contact' };
				}
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
