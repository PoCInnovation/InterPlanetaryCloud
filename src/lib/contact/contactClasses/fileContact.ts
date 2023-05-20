import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, post } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';
import Contact from 'lib/contact/contact';

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

class ContactFile extends Contact {

    public async updateFileName(concernedFile: IPCFile, newName: string, sharedFiles: IPCFile[]): Promise<ResponseType> {
		try {
			let fileFound = false;
			await Promise.all(
				this.contacts.map(async (contact) => {
					const file = contact.files.find((f) => f.id === concernedFile.id);
					if (file) {
						file.name = newName;
						file.logs.push({
							action: `Renamed file to ${newName}`,
							date: Date.now(),
						});
						fileFound = true;
						await this.publishAggregate();
					}
				}),
			);
			if (!fileFound) {
				const file = sharedFiles.find((f) => f.id === concernedFile.id);
				if (!file) {
					return { success: false, message: 'File not found' };
				}
				await post.Publish({
					account: this.account,
					postType: 'InterPlanetaryCloud',
					content: { file: { ...concernedFile, name: newName }, tags: ['rename', concernedFile.id] },
					channel: 'TEST',
					storageEngine: ItemType.ipfs,
				});
			}
			return { success: true, message: 'Filename updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update this filename' };
		}
	}
}

export default ContactFile;