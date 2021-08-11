import { account } from 'aleph-ts';
import Web3 from 'web3';
import User from "./user";
import {useUserContext} from "../contexts/user";

export class AuthError extends Error {}

export default class Auth {
	public async logout(): Promise<void> {
		window.localStorage.clear();
	}

	public async signup(username: string): Promise<string | undefined> {
		const newAccount = await account.ethereum.newAccount({ name: username });
		console.log(newAccount);

		return newAccount.mnemonics?.phrase;
	}

	public async login(username: string, mnemonics: string): Promise<boolean> {
		try {
			const { setUser } = useUserContext();
			const importedAccount = await account.ethereum.importAccount({
				mnemonics,
				name: username,
			});
			setUser(new User(importedAccount));
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	public async login_with_metamask(): Promise<boolean> {
		try {
			const { setUser } = useUserContext();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (typeof (window as any).ethereum !== 'undefined') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				const importedFromProvider = await account.ethereum.fromProvider(Web3.givenProvider);

				setUser(new User(importedFromProvider));
				console.log(importedFromProvider);
				return true;
			}
			return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}
