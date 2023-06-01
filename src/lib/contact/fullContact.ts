import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, post } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';

import type {
	AggregateContentType,
	AggregateType,
	IPCContact,
	IPCFile,
	IPCFolder,
	IPCUpdateContent,
	ResponseType,
} from 'types/types';

import { ALEPH_CHANNEL } from 'config/constants';
import ContactFile from './contactClasses/fileContact';
import Contact from './contact';

class FullContact {

	public account: accounts.ethereum.ETHAccount;

	public contact: Contact;

	public files: ContactFile;

	constructor(importedAccount: accounts.ethereum.ETHAccount) {
		this.account = importedAccount;
		this.contact = new Contact(this.account);
		this.files = new ContactFile(this.account);
	}	
}

export default FullContact;