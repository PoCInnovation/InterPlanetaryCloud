import { accounts, post, store } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';

import fileDownload from 'js-file-download';
import { StorageEngine } from 'aleph-sdk-ts/messages/message';

export function ArraybufferToString(ab: ArrayBuffer): string {
	return new TextDecoder().decode(ab);
}

type IPCFile = {
	name: string;
	content: string;
	created_at: number;
};

type ResponseType = {
	success: boolean;
	message: string;
};

class Drive {
	public files: IPCFile[];

	public postsHash: string;

	private readonly account: accounts.base.Account | undefined;

	constructor(importedAccount: accounts.base.Account) {
		this.files = [];
		this.account = importedAccount;
		this.postsHash = '';
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

				const postMessage = userData.posts.map((postContent) => {
					const itemContent = JSON.parse(postContent.item_content);
					if (itemContent.content.header === 'InterPlanetaryCloud2.0 Header') {
						this.files = [];
						this.postsHash = postContent.hash;
						if (itemContent.content.files.length > 0) {
							itemContent.content.files[0].map((file: IPCFile) => {
								this.files.push(file);
								return true;
							});
						}
						return true;
					}
					return false;
				});
				if (postMessage.length !== 1) {
					if (postMessage.length > 1) {
						return { success: false, message: 'Too many post messages' };
					}
					console.log('Create Post Message');
					const newPostPublishResponse = await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: 'TEST',
						inlineRequested: true,
						storageEngine: StorageEngine.IPFS,
						account: this.account,
						postType: '',
						content: {
							header: 'InterPlanetaryCloud2.0 Header',
							files: this.files,
						},
					});
					this.postsHash = newPostPublishResponse.item_hash;
				}
				return { success: true, message: 'Drive loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to load drive' };
		}
	}

	public async upload(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				const encryptedContentFile = CryptoJS.AES.encrypt(file.content, 'test').toString();

				const newStoreFile = new File([encryptedContentFile], file.name, {
					type: 'text/plain',
				});

				const fileHashPublishStore = await store.Publish({
					channel: 'TEST',
					account: this.account,
					fileObject: newStoreFile,
					storageEngine: StorageEngine.IPFS,
					APIServer: DEFAULT_API_V2,
				});

				const newFile: IPCFile = {
					name: file.name,
					content: fileHashPublishStore,
					created_at: file.created_at,
				};

				this.files.push(newFile);
				await post.Publish({
					APIServer: DEFAULT_API_V2,
					channel: 'TEST',
					inlineRequested: true,
					storageEngine: StorageEngine.IPFS,
					account: this.account,
					postType: 'amend',
					content: {
						header: 'InterPlanetaryCloud2.0 Header',
						files: [this.files],
					},
					ref: this.postsHash,
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

				const decryptedContentFile = CryptoJS.AES.decrypt(ArraybufferToString(storeFile), 'test').toString(
					CryptoJS.enc.Utf8,
				);

				const blob = new Blob([decryptedContentFile]);
				fileDownload(blob, file.name);
				return { success: true, message: 'File downloaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to download the file' };
		}
	}
}

class User {
	public account: accounts.base.Account | undefined;

	public drive: Drive;

	constructor(importedAccount: accounts.base.Account) {
		this.account = importedAccount;
		this.drive = new Drive(this.account);
	}
}

export type { IPCFile };
export default User;
