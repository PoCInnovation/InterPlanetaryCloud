import { account } from 'aleph-ts';

// class Drive {
// 	public files: unknown[];

// 	constructor() {
// 		this.files = [];
// 	}

// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
// 	public async load() {}

// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
// 	public async add() {}
// }

export default class User {
	public account: account.ethereum.ETHAccount | undefined;

	constructor(importedAccount: account.ethereum.ETHAccount) {
		this.account = importedAccount;
	}
}
