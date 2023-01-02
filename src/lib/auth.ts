import { accounts } from 'aleph-sdk-ts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/dist/global';
import { aggregate } from 'aleph-sdk-ts/dist/messages';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';

import { ALEPH_CHANNEL } from 'config/constants';

import User from 'lib/user';

import { AggregateType, IPCConfig } from 'types/types';

type AuthReturnType = {
	user: User | undefined;
	message: string;
};

class Auth {
	private defaultConfig: IPCConfig = {
		theme: 'light',
		defaultEntrypoint: 'main:app',
		defaultName: '[userName]@[repositoryName]',
	};

	public async logout(): Promise<void> {
		localStorage.clear();
	}

	private async createAggregate(account: accounts.ethereum.ETHAccount): Promise<void> {
		try {
			await aggregate.Get<AggregateType>({
				address: account.address,
				keys: ['InterPlanetaryCloud'],
			});
		} catch (error) {
			aggregate.Publish({
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
							files: [],
							folders: [],
							config: this.defaultConfig,
						},
					],
					programs: [],
				},
			});
		}
	}

	public async signup(): Promise<AuthReturnType & { mnemonic: string | undefined }> {
		try {
			const { mnemonic, account } = accounts.ethereum.NewAccount();

			const user = new User(account, this.defaultConfig);

			await this.createAggregate(account);

			return { user, mnemonic, message: 'Successful signup' };
		} catch (err) {
			console.error(err);
			return { user: undefined, mnemonic: undefined, message: 'Failed to signup' };
		}
	}

	public async loginWithCredentials(mnemonic: string, importedConfig: IPCConfig): Promise<AuthReturnType> {
		try {
			const importedAccount = accounts.ethereum.ImportAccountFromMnemonic(mnemonic);
			const user = new User(importedAccount, importedConfig);

			await this.createAggregate(importedAccount);

			return { user, message: 'Successful login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
	}

	public async loginWithProvider(importedConfig: IPCConfig): Promise<AuthReturnType> {
		try {
			const account = await accounts.ethereum.GetAccountFromProvider(window.ethereum);
			const user = new User(account, importedConfig);

			await this.createAggregate(account);

			return { user, message: 'Successful login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
	}
}

export type { AuthReturnType };
export default Auth;
