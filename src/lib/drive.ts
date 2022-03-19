import { accounts, post, store } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import fileDownload from 'js-file-download';

import CryptoJS from 'crypto-js';

import { ArraybufferToString } from 'utils/arraytbufferToString';

import { IPCContact, IPCFile, ResponseType } from 'types/types';
import EthCrypto from 'eth-crypto';

class Drive {
	public files: IPCFile[];

	public filesPostHash: string;

	private readonly account: accounts.base.Account | undefined;

	private private_key: string;

	constructor(importedAccount: accounts.base.Account, private_key: string) {
		this.files = [];
		this.account = importedAccount;
		this.filesPostHash = '';
		this.private_key = private_key;
	}

	// TODO load without any IPCFile
	public async loadShared(contacts: IPCContact[]): Promise<ResponseType> {
		try {
			if (this.account) {
				console.log(contacts);
				await Promise.all(
					contacts.map(async (contact) => {
						console.log('!!');
						if (this.account!.address !== contact.address) {
							console.log('Address contact: ', contact.address);
							const files: IPCFile[] = [];
							const userData = await post.Get({
								APIServer: DEFAULT_API_V2,
								types: '',
								pagination: 200,
								page: 1,
								refs: [],
								addresses: [contact.address],
								tags: [],
								hashes: [],
							});

							console.log(userData.posts);
							await Promise.all(
								userData.posts.map(async (postContent) => {
									const itemContent = JSON.parse(postContent.item_content);

									console.log('h', itemContent.content.header);
									const temp = async () => {
										if (itemContent.content.header === 'InterPlanetaryCloud2.0 - Files') {
											console.log('Post files founded');
											itemContent.content.files.map((file: IPCFile) => {
												files.push(file);
												console.log('Files: ', files);
												return true;
											});
											return true;
										}
										return true;
									};

									await temp();
									if (itemContent.content.header === 'InterPlanetaryCloud2.0 - Contacts') {
										console.log('Post contacts founded');
										await Promise.all(
											itemContent.content.contacts.map(async (contactToFind: IPCContact) => {
												if (contactToFind.address === this.account!.address) {
													console.log(contactToFind.files);
													await Promise.all(
														contactToFind.files.map(async (fileShared: IPCFile) => {
															console.log('!!2');
															console.log(fileShared.key);
															console.log(
																await EthCrypto.decryptWithPrivateKey(this.private_key.slice(2), fileShared.key),
															);
															await Promise.all(
																files.map(async (contactFile: IPCFile) => {
																	console.log('!!3');
																	if (contactFile.content === fileShared.hash) {
																		console.log('!!3');
																		this.files.push({
																			name: contactFile.name,
																			content: contactFile.content,
																			created_at: contactFile.created_at,
																			key: CryptoJS.AES.encrypt(
																				await EthCrypto.decryptWithPrivateKey(
																					this.private_key.slice(2),
																					fileShared.key,
																				),
																				this.private_key,
																			).toString(), // TODO improve because it's ugly
																		});
																		return true;
																	}
																	return false;
																}),
															);
															return true;
														}),
													);
													return true;
												}
												return false;
											}),
										);
										return true;
									}
									return false;
								}),
							);
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

	// TODO upload without any IPCFile
	public async upload(file: IPCFile, key: string): Promise<ResponseType> {
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
					key: await EthCrypto.encryptWithPublicKey(this.account.publicKey, key),
				};

				this.files.push(newFile);

				return { success: true, message: 'File uploaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to upload the file' };
		}
	}

	// TODO download without any IPCFile
	public async download(file: IPCFile): Promise<ResponseType> {
		try {
			if (this.account) {
				const storeFile = await store.Get({
					APIServer: DEFAULT_API_V2,
					fileHash: file.hash,
				});

				const keyFile = await EthCrypto.decryptWithPrivateKey(this.private_key.slice(2), file.key);
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
			console.log(err);
			return { success: false, message: 'Failed to download the file' };
		}
	}
}

export default Drive;
