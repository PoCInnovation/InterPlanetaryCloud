import { accounts } from 'aleph-sdk-ts';

import { mnemonicToPrivateKey } from 'utils/mnemonicToPrivateKey';

import Drive from './drive';

class User {
	public account: accounts.base.Account | undefined;

	public drive: Drive;

	constructor(importedAccount: accounts.base.Account, mnemonic: string) {
		this.account = importedAccount;
		this.drive = new Drive(this.account, mnemonicToPrivateKey(mnemonic));
	}
}

export default User;
