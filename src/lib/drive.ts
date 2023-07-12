import { accounts } from 'aleph-sdk-ts';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/dist/global';
import { aggregate, forget, store } from 'aleph-sdk-ts/dist/messages';
import { ItemType } from 'aleph-sdk-ts/dist/messages/message';
import { ETHLedgerAccount } from 'aleph-sdk-ts/dist/accounts/providers/Ledger/ethereum';
import fileDownload from 'js-file-download';

import { ALEPH_CHANNEL } from 'config/constants';

import type {
	AggregateType,
	IPCContact,
	IPCFile,
	IPCFolder,
	IPCProgram,
	ResponseType,
	UploadResponse,
} from 'types/types';

export const MONTH_MILLIS = 86400 * 30 * 1000;

class Drive {
	public files: IPCFile[];

	public programs: IPCProgram[];

	public folders: IPCFolder[];

	public sharedFiles: IPCFile[];

	public sharedPrograms: IPCProgram[];

	private readonly account: accounts.ethereum.ETHAccount | ETHLedgerAccount;

	constructor(importedAccount: accounts.ethereum.ETHAccount | ETHLedgerAccount) {
		this.files = [];
		this.sharedFiles = [];
		this.folders = [];
		this.account = importedAccount;
		this.programs = [];
		this.sharedPrograms = [];
	}

	public async loadShared(contacts: IPCContact[]): Promise<ResponseType> {
		try {
			if (this.account) {
				this.sharedFiles = [];
				this.sharedPrograms = [];
				await Promise.all(
					contacts.map(async (contact) => {
						const aggr = await aggregate.Get<AggregateType>({
							address: contact.address,
							keys: ['InterPlanetaryCloud'],
						});

						const found = aggr.InterPlanetaryCloud.contacts.find((c) => c.address === this.account.address);
						if (found) {
							if (contact.address === this.account.address) {
								this.files = found.files;
								this.folders = found.folders;
								this.programs = found.programs;
							} else {
								this.sharedFiles = this.sharedFiles.concat(found.files);
								this.sharedPrograms = this.sharedPrograms.concat(found.programs);
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

	public async upload(
		file: IPCFile,
		content: ArrayBuffer,
		infos: { key: ArrayBuffer; iv: Uint8Array },
	): Promise<UploadResponse> {
		try {
			if (content) {
				const fileHashPublishStore = await store.Publish({
					channel: ALEPH_CHANNEL,
					account: this.account,
					fileObject: Buffer.from(
						await crypto.subtle.encrypt(
							{
								name: 'AES-GCM',
								iv: infos.iv,
							},
							await crypto.subtle.importKey(
								'raw',
								infos.key,
								{
									name: 'AES-GCM',
									length: 256,
								},
								true,
								['encrypt', 'decrypt'],
							),
							Buffer.from(content),
						),
					),
					storageEngine: ItemType.ipfs,
					APIServer: DEFAULT_API_V2,
				});

				const newFile: IPCFile = {
					...file,
					hash: fileHashPublishStore.content.item_hash,
					encryptInfos: {
						key: (await this.account.encrypt(Buffer.from(infos.key))).toString('hex'),
						iv: (await this.account.encrypt(Buffer.from(infos.iv))).toString('hex'),
					},
				};
				return { success: true, message: 'File uploaded', file: newFile };
			}
			return { success: false, message: 'Content is empty', file: undefined };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload the file', file: undefined };
		}
	}

	public async autoDelete() {
		try {
			const filesToDelete = this.files.filter(
				(file) => file.deletedAt !== null && Date.now() - file.deletedAt >= MONTH_MILLIS,
			);
			await this.delete(filesToDelete.map((file) => file.hash));
		} catch (err) {
			console.error(err);
		}
	}

	public async delete(fileHashes: string[]): Promise<ResponseType> {
		try {
			await forget.Publish({
				APIServer: DEFAULT_API_V2,
				channel: ALEPH_CHANNEL,
				hashes: fileHashes,
				storageEngine: ItemType.ipfs,
				account: this.account,
			});

			this.files = this.files.filter((file) => !fileHashes.includes(file.hash));

			return { success: true, message: 'File deleted' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete the file' };
		}
	}

	public async download(file: IPCFile): Promise<ResponseType> {
		try {
			const storeFile = await store.Get({ fileHash: file.hash });

			const decryptedKey = await this.account.decrypt(Buffer.from(file.encryptInfos.key, 'hex'));
			const decryptedIv = await this.account.decrypt(Buffer.from(file.encryptInfos.iv, 'hex'));

			const decryptedFile = await crypto.subtle.decrypt(
				{
					name: 'AES-GCM',
					iv: decryptedIv,
				},
				await crypto.subtle.importKey(
					'raw',
					decryptedKey,
					{
						name: 'AES-GCM',
						length: 256,
					},
					true,
					['encrypt', 'decrypt'],
				),
				Buffer.from(storeFile),
			);
			fileDownload(decryptedFile, file.name);
			return { success: true, message: 'File downloaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to download the file' };
		}
	}
}

export default Drive;
