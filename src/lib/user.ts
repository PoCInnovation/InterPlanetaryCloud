import { accounts } from 'aleph-sdk-ts';

import { mnemonicToPrivateKey } from 'utils/mnemonicToPrivateKey';

import Drive from 'lib/drive';
import Contact from 'lib/contact';
import Computing from 'lib/computing';

class User {
	public account: accounts.base.Account | undefined;

	public drive: Drive;

	public computing: Computing;

	public contact: Contact;

	constructor(importedAccount: accounts.base.Account, mnemonic: string) {
		this.account = importedAccount;
		this.drive = new Drive(this.account, mnemonicToPrivateKey(mnemonic));
		this.computing = new Computing(this.account);
		this.contact = new Contact(this.account, mnemonicToPrivateKey(mnemonic));
	}
}

export default User;
