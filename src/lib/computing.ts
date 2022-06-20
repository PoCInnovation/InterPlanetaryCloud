import { accounts, program, post } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import { IPCProgram, ResponseType } from 'types/types';

class Computing {
	public programs: IPCProgram[];

	public programsPostHash: string;

	private readonly account: accounts.base.Account | undefined;

	constructor(importedAccount: accounts.base.Account) {
		this.programs = [];
		this.programsPostHash = '';
		this.account = importedAccount;
	}

	public async loadPrograms(): Promise<ResponseType> {
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
					if (itemContent.content.headers === 'InterPlanetaryCloud2.0 - Programs') {
						this.programsPostHash = postContent.hash;
						if (itemContent.content.programs.length > 0) {
							itemContent.content.programs.map((importedProgram: IPCProgram) => {
								this.programs.push(importedProgram);
								return true;
							});
						}
						return true;
					}
					return false;
				});

				if (this.programsPostHash === '') {
					const newPostPublishResponse = await post.Publish({
						APIServer: DEFAULT_API_V2,
						channel: ALEPH_CHANNEL,
						inlineRequested: true,
						storageEngine: ItemType.ipfs,
						account: this.account,
						postType: '',
						content: {
							headers: 'InterPlanetaryCloud2.0 - Programs',
							programs: [],
						},
					});
					this.programsPostHash = newPostPublishResponse.item_hash;
				}
				return { success: true, message: 'Programs loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Failed to load programs' };
		}
	}

	public async uploadProgram(myProgram: IPCProgram, uploadFile: File): Promise<ResponseType> {
		try {
			if (this.account) {
				const programHashPublishProgram = await program.publish({
					channel: ALEPH_CHANNEL,
					account: this.account,
					storageEngine: ItemType.storage,
					inlineRequested: true,
					APIServer: DEFAULT_API_V2,
					file: uploadFile,
					entrypoint: 'main:app',
				});

				const newProgram: IPCProgram = {
					name: myProgram.name,
					hash: programHashPublishProgram.item_hash,
					created_at: myProgram.created_at,
				};

				this.programs.push(newProgram);

				return { success: true, message: 'Program uploaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.log(err);
			return { success: false, message: 'Failed to upload program' };
		}
	}

	public async addToUser(): Promise<ResponseType> {
		try {
			if (this.account) {
				await post.Publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account!,
					postType: 'amend',
					content: {
						headers: 'InterPlanetaryCloud2.0 - Programs',
						programs: this.programs,
					},
					ref: this.programsPostHash,
				});

				return { success: true, message: 'File added to the user' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Failed to add program to user' };
		}
	}
}

export default Computing;
