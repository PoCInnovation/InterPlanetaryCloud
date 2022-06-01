import { accounts, program } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import { IPCProgram, ResponseType } from 'types/types';

class Computing {
	public programs: IPCProgram[];

	private readonly account: accounts.base.Account | undefined;

	constructor(importedAccount: accounts.base.Account) {
		this.programs = [];
		this.account = importedAccount;
	}

	public async loadPrograms(): Promise<ResponseType> {
		try {
			if (this.account) {
				console.log('Programs loaded');
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
}

export default Computing;
