import { account } from 'aleph-ts';

import Web3 from 'web3';

import User from './user';

type AuthReturnType = {
	user: User | undefined;
	message: string;
};

class Auth {
	public async logout(): Promise<void> {
		localStorage.clear();
	}

	public async signup(username: string): Promise<AuthReturnType> {
		try {
			const newAccount = await account.ethereum.newAccount({ name: username });
			const user = new User(newAccount);

			return { user, message: 'Successful signup' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to signup' };
		}
	}

	public async loginWithCredentials(username: string, mnemonics: string): Promise<AuthReturnType> {
		try {
			const importedAccount = await account.ethereum.importAccount({
				mnemonics,
				name: username,
			});
			const user = new User(importedAccount);

			return { user, message: 'Successful login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
	}

	public async loginWithMetamask(): Promise<AuthReturnType> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (typeof (window as any).ethereum !== 'undefined') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				const importedFromProvider = await account.ethereum.fromProvider(Web3.givenProvider);
				const user = new User(importedFromProvider);

				return { user, message: 'Successfully logged in' };
			}
			return { user: undefined, message: 'Please install Metamask' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
	}
}

export type { AuthReturnType };
export default Auth;
