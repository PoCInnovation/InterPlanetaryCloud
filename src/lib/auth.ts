import { account } from 'aleph-ts';
import Web3 from 'web3';

import User from './user';

export type AuthReturnType = {
	user: User | undefined;
	message: string;
};

export default class Auth {
	public async logout(): Promise<void> {
		localStorage.clear();
	}

	public async signup(username: string): Promise<AuthReturnType> {
		try {
			const newAccount = await account.ethereum.newAccount({ name: username });
			const user = new User(newAccount);

			return { user, message: 'Successfully signup' };
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

			return { user, message: 'Successfully logged in' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	public async loginWithMetamask(): Promise<AuthReturnType> {
		try {
			if (typeof (window as any).ethereum !== 'undefined') {
				await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				const importedFromProvider = await account.ethereum.fromProvider(Web3.givenProvider);
				const user = new User(importedFromProvider);

				return { user, message: 'Successfully logged in' };
			}
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Failed to login' };
		}
		return { user: undefined, message: 'Failed to login, please install Metamask' };
	}
}
