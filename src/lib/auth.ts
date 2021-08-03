import { account } from 'aleph-ts';
import Web3 from 'web3';

export class AuthError extends Error {}

export default class Auth {
	public async logout(): Promise<void> {
		window.localStorage.clear();
	}

	public async signup(username: string): Promise<boolean> {
		const newAccount = await account.ethereum.newAccount({ name: username });

		if (newAccount) window.localStorage.setItem('username', username);
		return newAccount !== undefined;
	}

	public async login(): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof (window as any).ethereum !== 'undefined') {
			console.log('Metamask is ready !');

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
			const importedFromProvider = await account.ethereum.fromProvider(Web3.givenProvider);

			console.log('THE IMPORTED ETH ACCOUNT');
			console.log(importedFromProvider);
		} else {
			console.log('Please install metamask');
		}
	}
}
