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
import ContactFolder from './contactClasses/folderContact';
import ManageContact from './contactClasses/manageContact';

class FullContact {

	public account: accounts.ethereum.ETHAccount;

	public contact: Contact;

	public files: ContactFile;

	// public folders: ContactFolder;

	// public manage: ManageContact;

	constructor(importedAccount: accounts.ethereum.ETHAccount) {
		this.account = importedAccount;
		this.contact = new Contact(this.account);
		this.contact.load();
		this.files = new ContactFile(this.contact);
		// this.folders = new ContactFolder(this.contact);
		// this.manage = new ManageContact(this.contact);
	}	
}

export default FullContact;