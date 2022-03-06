import { accounts, post, store } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import fileDownload from 'js-file-download';

import CryptoJS from 'crypto-js';

import { ArraybufferToString } from 'utils/arraytbufferToString';

import { IPCFile, ResponseType } from 'types/types';

class Drive {
	public files: IPCFile[];

	public filesPostHash: string;

	public contactsPostHash: string;

	private readonly account: accounts.base.Account | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.base.Account, private_key: string) {
		this.files = [];
		this.account = importedAccount;
		this.filesPostHash = '';
		this.contactsPostHash = '';
		this.private_key = private_key;
	}

	public async load(): Promise<ResponseType> {
		try {
			if (this.account) {
				const userData = await post.Get({
					APIServer: DEFAULT_API_V2,
					types: '',
					pagination: 200,
					page: 1,
					refs: [],
					addresses: [this.account.address],
					tags: [],
					hashes: [],
				});

				userData.posts.map((postContent) => {
					const itemContent = JSON.parse(postContent.item_content);
					if (itemContent.content.header === 'InterPlanetaryCloud2.0 - Files') {
						this.filesPostHash = postContent.hash;
						if (itemContent.content.files.length > 0) {
							itemContent.content.files.map((file: IPCFile) => {
								this.files.push(file);
								return true;
							});
						}
						return true;
					}
					return false;
				});

				if (this.filesPostHash === '') {
					console.log('Create Post Message');
					const newPostPublishResponse = await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: ALEPH_CHANNEL,
						inlineRequested: true,
						storageEngine: ItemType.ipfs,
						account: this.account,
						postType: '',
						content: {
							header: 'InterPlanetaryCloud2.0 - Files',
							files: this.files,
						},
					});
					this.filesPostHash = newPostPublishResponse.item_hash;
				}
				return { success: true, message: 'Drive loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to load drive' };
		}
	}

	public async upload(file: IPCFile, key: string): Promise<ResponseType> {
		try {
			if (this.account) {
				const encryptedContentFile = CryptoJS.AES.encrypt(file.content, key).toString();

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
					content: fileHashPublishStore.content.item_hash,
					created_at: file.created_at,
				};

				this.files.push(newFile);
				await post.Publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
					postType: 'amend',
					content: {
						header: 'InterPlanetaryCloud2.0 - Files',
						files: this.files,
					},
					ref: this.filesPostHash,
				});

				return { success: true, message: 'File uploaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to upload the file' };
		}
	}

	public async download(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				const storeFile = await store.Get({
					APIServer: DEFAULT_API_V2,
					fileHash: file.content,
				});

				const decryptedContentFile = CryptoJS.AES.decrypt(ArraybufferToString(storeFile), this.private_key).toString(
					CryptoJS.enc.Utf8,
				);

				// const blob = new Blob([decryptedContentFile]);
				const newFile = new File([decryptedContentFile], file.name, {
					type: 'plain/text',
				});
				fileDownload(newFile, file.name);
				return { success: true, message: 'File downloaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to download the file' };
		}
	}
}

export default Drive;
