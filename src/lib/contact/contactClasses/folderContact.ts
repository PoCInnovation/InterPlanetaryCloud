import type {
	IPCFolder,
	ResponseType,
} from 'types/types';

import Contact from '../contact';

class ContactFolder {

    public contact: Contact;

	constructor(contactClass: Contact) {
		this.contact = contactClass;
	}

    public async create(folder: IPCFolder): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === this.contact.account.address);

			if (contact) {
				contact.folders.push(folder);
				await this.contact.publishAggregate();
				return { success: true, message: 'Folder created' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async move(folder: IPCFolder, newPath: string): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === this.contact.account.address);
			const fullPath = `${folder.path}${folder.name}/`;

			if (contact) {
				contact.folders = contact.folders.map((f) => {
					if (f.path.startsWith(fullPath))
						return {
							...f,
							path: f.path.replace(folder.path, newPath),
							logs: [
								...f.logs,
								{
									action: `Moved folder to ${fullPath}`,
									date: Date.now(),
								},
							],
						};
					if (f === folder) return { ...f, path: newPath };
					return f;
				});
				contact.files = contact.files.map((f) => {
					if (f.path.startsWith(fullPath)) return { ...f, path: f.path.replace(folder.path, newPath) };
					return f;
				});

				await this.contact.publishAggregate();
				return { success: true, message: 'Folder created' };
			}
			return { success: false, message: 'Failed to load contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to create the folder' };
		}
	}

	public async delete(folder: IPCFolder): Promise<ResponseType> {
		try {
			const contact = this.contact.contacts.find((c) => c.address === this.contact.account.address);

			if (contact) {
				const fullPath = `${folder.path}${folder.name}/`;
				contact.folders = contact.folders.filter(
					(f) => !f.path.startsWith(fullPath) && (f.path !== folder.path || f.createdAt !== folder.createdAt),
				);

				await this.contact.publishAggregate();

				return { success: true, message: 'Folder deleted' };
			}
			return { success: false, message: 'Failed to find your contact' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the folder' };
		}
	}

}

export default ContactFolder;
