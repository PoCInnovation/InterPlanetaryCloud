import { accounts } from 'aleph-sdk-ts';

import User from './user';

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
