import { accounts } from 'aleph-sdk-ts';
import { aggregate } from 'aleph-sdk-ts/dist/messages';

import Computing from 'lib/computing';
import Contact from 'lib/contact/contact';
import Drive from 'lib/drive';

import { AggregateType, IPCConfig, IPCContact } from 'types/types';

class User {
	public account: accounts.ethereum.ETHAccount;

	public drive: Drive;

	public computing: Computing;

	public contact: Contact;

	public config: IPCConfig;

	constructor(importedAccount: accounts.ethereum.ETHAccount, importedConfig: IPCConfig) {
		this.account = importedAccount;
		this.config = importedConfig;
		this.drive = new Drive(this.account);
		this.computing = new Computing(this.account);
		this.contact = new Contact(this.account);
	}

	public async loadConfig() {
		try {
			await Promise.all(
				this.contact.contacts.map(async (contact) => {
					const aggr = await aggregate.Get<AggregateType>({
						address: contact.address,
						keys: ['InterPlanetaryCloud'],
					});

					const found = aggr.InterPlanetaryCloud.contacts.find((c: IPCContact) => c.address === this.account.address);
					if (found?.config) this.config = found.config;
				}),
			);

			return { success: true, message: 'Config loaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load account' };
		}
	}
}

export default User;
