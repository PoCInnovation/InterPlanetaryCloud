import { accounts, aggregate, forget, store } from 'aleph-sdk-ts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import CryptoJS from 'crypto-js';
import { decryptWithPrivateKey, encryptWithPublicKey } from 'eth-crypto';
import fileDownload from 'js-file-download';

import { ALEPH_CHANNEL } from 'config/constants';

import type { AggregateType, IPCContact, IPCFile, IPCFolder, ResponseType, UploadResponse } from 'types/types';

import ArraybufferToString from 'utils/arraybufferToString';

export const MONTH_MILLIS = 86400 * 30 * 1000

class Drive {
	public files: IPCFile[];

	public folders: IPCFolder[];

	public sharedFiles: IPCFile[];

	private readonly account: accounts.ethereum.ETHAccount | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.ethereum.ETHAccount, private_key: string) {
		this.files = [];
		this.folders = [];
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

						const found = aggr.InterPlanetaryCloud.contacts.find((c) => c.address === this.account!.address);
						if (found) {
							if (contact.address === this.account!.address) {
								this.files = found.files;
								this.folders = found.folders;
							} else {
								this.sharedFiles = this.sharedFiles.concat(found.files);
							}
						}
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
					...file,
					hash: fileHashPublishStore.content.item_hash,
					key: await encryptWithPublicKey(this.account.publicKey.slice(2), key),
				};

				return { success: true, message: 'File uploaded', file: newFile };
			}
			return { success: false, message: 'Failed to load account', file: undefined };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload the file', file: undefined };
		}
	}

	public async autoDelete() {
		try {
			const filesToDelete = this.files.filter((file) => file.deletedAt !== null && Date.now() - file.deletedAt >= MONTH_MILLIS)
			await this.delete(filesToDelete.map((file) => file.hash))
		} catch (err) {
			console.error(err)
		}
	}

	public async delete(fileHashes: string[]): Promise<ResponseType> {
		try {
			if (this.account) {
				await forget.publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					hashes: fileHashes,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
				});

				this.files = this.files.filter((file) => !fileHashes.includes(file.hash));

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
