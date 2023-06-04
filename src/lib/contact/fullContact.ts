import { accounts } from 'aleph-sdk-ts';
import ContactFile from './contactClasses/fileContact';
import Contact from './contact';
import ContactFolder from './contactClasses/folderContact';
import ManageContact from './contactClasses/manageContact';
import Computing from './contactClasses/programContact';

class FullContact {

	public account: accounts.ethereum.ETHAccount;

	public contact: Contact;

	public files: ContactFile;

	public folders: ContactFolder;

	public manage: ManageContact;

	public computing: Computing;


	constructor(importedAccount: accounts.ethereum.ETHAccount) {
		this.account = importedAccount;
		this.contact = new Contact(this.account);
		this.contact.load();
		this.files = new ContactFile(this.contact);
		this.folders = new ContactFolder(this.contact);
		this.manage = new ManageContact(this.contact);
		this.computing = new Computing(this.contact.account);
	}	
}

export default FullContact;