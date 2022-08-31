import { accounts, aggregate } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import User from 'lib/user';
import { AggregateType, IPCConfig } from 'types/types';

type AuthReturnType = {
	user: User | undefined;
	mnemonic: string | undefined;
	message: string;
};

class Auth {
	private defaultConfig: IPCConfig = {
		theme: 'white',
	};

	public async logout(): Promise<void> {
		localStorage.clear();
	}

	private async createAggregate(account: accounts.ethereum.ETHAccount): Promise<void> {
		try {
			await aggregate.Get<AggregateType>({
				APIServer: DEFAULT_API_V2,
				address: account.address,
				keys: ['InterPlanetaryCloud'],
			});
		} catch (error) {
			await aggregate.Publish({
				APIServer: DEFAULT_API_V2,
				channel: ALEPH_CHANNEL,
				inlineRequested: true,
				storageEngine: ItemType.ipfs,
				account,
				key: 'InterPlanetaryCloud',
				content: {
					contacts: [
						{
							name: 'Owner (Me)',
							address: account.address,
							publicKey: account.publicKey,
							config: {
								theme: 'white',
							},
							files: [],
							folders: [],
						},
					],
					programs: [],
				},
			});
		}
	}

	public async signup(): Promise<AuthReturnType> {
		try {
			const { mnemonic, account } = accounts.ethereum.NewAccount();

			const user = new User(account, mnemonic);

			await this.createAggregate(account);

			return { user, mnemonic, message: 'Successful signup' };
		} catch (err) {
			console.error(err);
			return { user: undefined, mnemonic: undefined, message: 'Failed to signup' };
		}
	}

	public async loginWithCredentials(mnemonic: string): Promise<AuthReturnType> {
		try {
			const importedAccount = accounts.ethereum.ImportAccountFromMnemonic(mnemonic);
			const user = new User(importedAccount, mnemonic);

			await this.createAggregate(importedAccount);
			console.log(user.config);

			return { user, mnemonic, message: 'Successful login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, mnemonic: undefined, message: 'Failed to login' };
		}
	}
}

export type { AuthReturnType };
export default Auth;
