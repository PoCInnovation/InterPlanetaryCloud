import { accounts, aggregate } from 'aleph-sdk-ts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';

import Computing from 'lib/computing';
import Contact from 'lib/contact';
import Drive from 'lib/drive';

import mnemonicToPrivateKey from 'utils/mnemonicToPrivateKey';

import { AggregateType, IPCConfig, IPCContact } from 'types/types';

class User {
	public account: accounts.ethereum.ETHAccount | undefined;

	public drive: Drive;

	public computing: Computing;

	public contact: Contact;

	public config: IPCConfig | undefined;

	public async loadConfig() {
		try {
			if (this.account) {
				await Promise.all(
					this.contact.contacts.map(async (contact) => {
						const aggr = await aggregate.Get<AggregateType>({
							APIServer: DEFAULT_API_V2,
							address: contact.address,
							keys: ['InterPlanetaryCloud'],
						});

						const found = aggr.InterPlanetaryCloud.contacts.find(
							(c: IPCContact) => c.address === this.account!.address,
						);
						if (found) this.config = found.config;
					}),
				);
			}
			return { success: true, message: 'Config loaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load account' };
		}
	}

	constructor(importedAccount: accounts.ethereum.ETHAccount, mnemonic: string, importedConfig: IPCConfig) {
		this.account = importedAccount;
		this.config = importedConfig;
		this.drive = new Drive(this.account, mnemonicToPrivateKey(mnemonic));
		this.computing = new Computing(this.account);
		this.contact = new Contact(this.account, mnemonicToPrivateKey(mnemonic));
	}
}

export default User;
