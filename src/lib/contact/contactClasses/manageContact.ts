import type {
	IPCContact,
	ResponseType,
} from 'types/types';

import Contact from '../contact';

class ManageContact {

	public contact: Contact;

	constructor(contactClass: Contact) {
		this.contact = contactClass;
	}

	public async add(contactToAdd: IPCContact): Promise<ResponseType> {
		try {
			if (this.contact.contacts.find((contact) => contact.address === contactToAdd.address)) {
				return { success: false, message: 'Contact already exist' };
			}
			this.contact.contacts.push(contactToAdd);

			await this.contact.publishAggregate();
			return { success: true, message: 'Contact added' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to add this contact' };
		}
	}

	public async remove(contactAddress: string): Promise<ResponseType> {
		try {
			if (contactAddress !== this.contact.account.address) {
				this.contact.contacts.forEach((contact, index) => {
					if (contact.address === contactAddress) {
						this.contact.contacts.splice(index, 1);
					}
				});

				await this.contact.publishAggregate();
				return { success: true, message: 'Contact deleted' };
			}
			return { success: false, message: "You can't delete your account" };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete this contact' };
		}
	}

	public async update(contactAddress: string, newName: string): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === contactAddress);

			if (contact) {
				contact.name = newName;
				await this.contact.publishAggregate();
				return { success: true, message: 'Contact updated' };
			}
			return { success: false, message: 'Contact does not exist' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this contact' };
		}
	}

	public async updateConfig(key: string, value: string): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === this.contact.account.address);
			if (contact?.config) {
				if (!contact.config[key]) {
					return { success: false, message: 'Invalid config key' };
				}
				contact.config[key].value = value;
				await this.contact.publishAggregate();
				return { success: true, message: `${contact.config[key].name} changed` };
			}
			return { success: false, message: 'Failed to find account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to change name' };
		}
	}
}

export default ManageContact;
