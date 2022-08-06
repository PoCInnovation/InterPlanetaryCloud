import { accounts, program, aggregate, forget } from 'aleph-sdk-ts';

import { DEFAULT_API_V2 } from 'aleph-sdk-ts/global';
import { ItemType, AggregateMessage } from 'aleph-sdk-ts/messages/message';
import { ALEPH_CHANNEL } from 'config/constants';

import type { IPCProgram, ResponseType, AggregateType, AggregateContentType } from 'types/types';

class Computing {
	public programs: IPCProgram[];

	private readonly account: accounts.base.Account | undefined;

	constructor(importedAccount: accounts.base.Account) {
		this.programs = [];
		this.account = importedAccount;
	}

	private async publishAggregate(): Promise<AggregateMessage<AggregateContentType>> {
		const aggr = await aggregate.Get<AggregateType>({
			APIServer: DEFAULT_API_V2,
			address: this.account!.address,
			keys: ['InterPlanetaryCloud'],
		});

		const content = aggr.InterPlanetaryCloud;
		content.programs = this.programs;

		return aggregate.Publish({
			APIServer: DEFAULT_API_V2,
			channel: ALEPH_CHANNEL,
			inlineRequested: true,
			storageEngine: ItemType.ipfs,
			account: this.account!,
			key: 'InterPlanetaryCloud',
			content,
		});
	}

	public async load(): Promise<ResponseType> {
		try {
			if (this.account) {
				const aggr = await aggregate.Get<AggregateType>({
					APIServer: DEFAULT_API_V2,
					address: this.account.address,
					keys: ['InterPlanetaryCloud'],
				});

				this.programs = aggr.InterPlanetaryCloud.programs;

				return { success: true, message: 'Programs loaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Failed to load programs' };
		}
	}

	public async deleteProgram(programHash: string): Promise<ResponseType> {
		try {
			if (this.account) {
				await forget.publish({
					APIServer: DEFAULT_API_V2,
					channel: ALEPH_CHANNEL,
					hashes: [programHash],
					inlineRequested: true,
					storageEngine: ItemType.ipfs,
					account: this.account,
				});

				return { success: true, message: 'program deleted' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete program' };
		}
	}

	public async uploadProgram(
		myProgram: IPCProgram,
		uploadFile: File,
		isRedeploy: boolean,
		oldProgramHash: IPCProgram | undefined,
	): Promise<ResponseType> {
		try {
			if (this.account) {
				// remove old program from user's programs array
				if (isRedeploy && oldProgramHash) {
					const newProgramsArray: IPCProgram[] = this.programs.filter(
						(oldProgram: IPCProgram) => oldProgram !== oldProgramHash,
					);
					this.programs = newProgramsArray;
				}

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
					...myProgram,
					hash: programHashPublishProgram.item_hash,
				};

				this.programs.push(newProgram);

				await this.publishAggregate();

				return { success: true, message: 'Program uploaded' };
			}
			return { success: false, message: 'Failed to load account' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload program' };
		}
	}
}

export default Computing;
