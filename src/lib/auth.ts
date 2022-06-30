import { accounts, aggregate } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import User from 'lib/user';

type AuthReturnType = {
	user: User | undefined;
	mnemonic: string | undefined;
	message: string;
};

class Auth {
	public async logout(): Promise<void> {
		localStorage.clear();
	}

	public async signup(): Promise<AuthReturnType> {
		try {
			const { mnemonic, account } = accounts.ethereum.NewAccount();

			const user = new User(account, mnemonic);

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
							files: [],
						},
					],
					programs: [],
				},
			});

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

			return { user, mnemonic, message: 'Successful login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, mnemonic: undefined, message: 'Failed to login' };
		}
	}
}

export type { AuthReturnType };
export default Auth;
