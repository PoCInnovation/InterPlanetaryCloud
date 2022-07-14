import { accounts, forget, aggregate, store } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import fileDownload from 'js-file-download';

import CryptoJS from 'crypto-js';

import { ArraybufferToString } from 'utils/arraytbufferToString';

import type { IPCContact, IPCFile, IPCFolder, ResponseType, UploadResponse, AggregateType } from 'types/types';
import { encryptWithPublicKey, decryptWithPrivateKey } from 'eth-crypto';

class Drive {
	public files: IPCFile[];

	public sharedFiles: IPCFile[];

	private readonly account: accounts.base.Account | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.base.Account, private_key: string) {
		this.files = [];
		this.sharedFiles = [];
		this.account = importedAccount;
		this.private_key = private_key;
	}

	public async loadShared(contacts: IPCContact[]): Promise<ResponseType> {
		try {
			if (this.account) {
				await Promise.all(
					contacts.map(async (contact) => {
						const aggr = await aggregate.Get<AggregateType>({
							APIServer: DEFAULT_API_V2,
							address: contact.address,
							keys: ['InterPlanetaryCloud'],
						});

						aggr.InterPlanetaryCloud.contacts.forEach((contactToFind: IPCContact) => {
							if (contactToFind.address === this.account!.address) {
								if (contact.address === this.account!.address) {
									this.files = this.files.concat(contactToFind.files);
								} else {
									this.sharedFiles = this.sharedFiles.concat(contactToFind.files);
								}
								return true;
							}
							return false;
						});
					}),
				);
				return { success: true, message: 'Shared drive loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load shared drive' };
		}
	}

	public async upload(file: IPCFile, key: string): Promise<UploadResponse> {
		try {
			if (this.account) {
				const encryptedContentFile = CryptoJS.AES.encrypt(file.hash, key).toString();

				const newStoreFile = new File([encryptedContentFile], file.name, {
					type: 'text/plain',
				});

				const fileHashPublishStore = await store.Publish({
					channel: ALEPH_CHANNEL,
					account: this.account,
					fileObject: newStoreFile,
					storageEngine: ItemType.ipfs,
					APIServer: DEFAULT_API_V2,
				});

				const newFile: IPCFile = {
					name: file.name,
					hash: fileHashPublishStore.content.item_hash,
					created_at: file.created_at,
					key: await encryptWithPublicKey(this.account.publicKey.slice(2), key),
					path: file.path,
				};

				return { success: true, message: 'File uploaded', file: newFile };
			}
			return { success: false, message: 'Failed to load account', file: undefined };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload the file', file: undefined };
		}
	}

	public async delete(fileHash: string): Promise<ResponseType> {
		try {
			if (this.account) {
				await forget.publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					hashes: [fileHash],
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
				});

				return { success: true, message: 'File deleted' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the file' };
		}
	}

	public async download(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				const storeFile = await store.Get({
					APIServer: DEFAULT_API_V2,
					fileHash: file.hash,
				});

				const keyFile = await decryptWithPrivateKey(this.private_key.slice(2), file.key);
				const decryptedContentFile = CryptoJS.AES.decrypt(ArraybufferToString(storeFile), keyFile).toString(
					CryptoJS.enc.Utf8,
				);

				const newFile = new File([decryptedContentFile], file.name, {
					type: 'plain/text',
				});
				fileDownload(newFile, file.name);
				return { success: true, message: 'File downloaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to download the file' };
		}
	}
}

export default Drive;
