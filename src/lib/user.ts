import { account, message } from 'aleph-ts';
import CryptoJS from 'crypto-js';
import fileDownload from 'js-file-download';

type UserData = {
	files: IPCFile[];
};

type ResponseType = {
	success: boolean;
	message: string;
};

type IPCFile = {
	name: string;
	content: string;
	created_at: number;
};

class Drive {
	public files: IPCFile[];

	private readonly account: account.ethereum.ETHAccount | undefined;

	constructor(importedAccount: account.ethereum.ETHAccount) {
		this.files = [];
		this.account = importedAccount;
	}

	public async load(): Promise<ResponseType> {
		try {
			if (this.account !== undefined) {
				const userDataAddress = `ipc.user.${this.account.address}`;
				let userData = await message.post.getPosts<UserData>(userDataAddress);

				if (userData.posts.length === 0) {
					const newUserData: UserData = { files: this.files };

					await message.post.submit(this.account.address, userDataAddress, newUserData, {
						userAccount: this.account,
						channel: 'TEST',
						api_server: message.constants.DEFAULT_SERVER_V2,
					});
					userData = await message.post.getPosts<UserData>(userDataAddress);
					this.files = userData.posts[userData.posts.length - 1].content.files;
				} else {
					this.files = userData.posts[userData.posts.length - 1].content.files;
				}
				return { success: true, message: 'Successfully loaded drive' };
			}
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to load drive' };
		}
		return { success: false, message: 'Failed to load drive' };
	}

	public async upload(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account !== undefined) {
				const userDataAddress = `ipc.user.${this.account.address}`;
				const userData = await message.post.getPosts<UserData>(userDataAddress);

				if (userData.posts.length > 0) {
					const encryptedFile: IPCFile = {
						name: file.name,
						content: CryptoJS.AES.encrypt(file.content, this.account.private_key).toString(),
						created_at: file.created_at,
					};
					this.files.push(encryptedFile);

					const newUserData: UserData = { files: this.files };
					await message.post.submit(this.account.address, 'amend', newUserData, {
						userAccount: this.account,
						channel: 'TEST',
						api_server: message.constants.DEFAULT_SERVER_V2,
						ref: userData.posts[userData.posts.length - 1].item_hash,
					});
					return { success: true, message: 'Successfully uploaded file' };
				}
			}
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload file' };
		}
		return { success: false, message: 'Failed to upload file' };
	}

	public async download(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account !== undefined) {
				const decryptedFile: IPCFile = {
					name: file.name,
					content: CryptoJS.AES.decrypt(file.content, this.account.private_key).toString(CryptoJS.enc.Utf8),
					created_at: file.created_at,
				};
				const blob = new Blob([decryptedFile.content]);
				fileDownload(blob, decryptedFile.name);
				return { success: true, message: 'Successfully downloaded file' };
			}
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to download file' };
		}
		return { success: false, message: 'Failed to download file' };
	}
}

export default class User {
	public account: account.ethereum.ETHAccount | undefined;

	public drive: Drive;

	constructor(importedAccount: account.ethereum.ETHAccount) {
		this.account = importedAccount;
		this.drive = new Drive(this.account);
	}
}
