import { account } from 'aleph-ts';
import Web3 from 'web3';
import User from './user';

type AuthReturnType = {
	user: User | undefined;
	message: string;
};

export class AuthError extends Error {}

export default class Auth {
	public async logout(): Promise<void> {
		window.localStorage.clear();
	}

	public async signup(username: string): Promise<AuthReturnType> {
		try {
			const newAccount = await account.ethereum.newAccount({ name: username });
			return { user: new User(newAccount), message: 'Successfull login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Signup failed' };
		}
	}

	public async login_with_credentials(username: string, mnemonics: string): Promise<AuthReturnType> {
		try {
			const importedAccount = await account.ethereum.importAccount({
				mnemonics,
				name: username,
			});
			return { user: new User(importedAccount), message: 'Successfull login' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Login failed' };
		}
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	public async login_with_metamask(): Promise<AuthReturnType> {
		try {
			if (typeof (window as any).ethereum !== 'undefined') {
				await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				const importedFromProvider = await account.ethereum.fromProvider(Web3.givenProvider);
				return { user: new User(importedFromProvider), message: 'Successfull login' };
			}
			return { user: undefined, message: 'Please install metamask' };
		} catch (err) {
			console.error(err);
			return { user: undefined, message: 'Login failed' };
		}
	}
}
