import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, post } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';

import type { AggregateContentType, AggregateType, IPCContact, IPCUpdateContent, ResponseType } from 'types/types';

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
}

export default Contact;
