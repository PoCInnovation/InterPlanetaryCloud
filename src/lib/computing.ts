import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, program } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';

import type { AggregateContentType, AggregateType, IPCProgram, ResponseType } from 'types/types';

import { ALEPH_CHANNEL } from 'config/constants';

class Computing {
	public programs: IPCProgram[];

	private readonly account: accounts.ethereum.ETHAccount;

	constructor(importedAccount: accounts.ethereum.ETHAccount) {
		this.programs = [];
		this.account = importedAccount;
	}

	public async publishAggregate(): Promise<AggregateMessage<AggregateContentType>> {
		const aggr = await aggregate.Get<AggregateType>({
			address: this.account.address,
			keys: ['InterPlanetaryCloud'],
		});

		const content = aggr.InterPlanetaryCloud;
		content.programs = this.programs;

		return aggregate.Publish({
			channel: ALEPH_CHANNEL,
			storageEngine: ItemType.ipfs,
			account: this.account,
			key: 'InterPlanetaryCloud',
			content,
		});
	}

	public async load(): Promise<ResponseType> {
		try {
			const aggr = await aggregate.Get<AggregateType>({
				address: this.account.address,
				keys: ['InterPlanetaryCloud'],
			});

			this.programs = aggr.InterPlanetaryCloud.programs;

			return { success: true, message: 'Programs loaded' };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Failed to load programs' };
		}
	}

	public async deleteProgram(programHash: string): Promise<ResponseType> {
		try {
			await forget.Publish({
				channel: ALEPH_CHANNEL,
				hashes: [programHash],
				storageEngine: ItemType.ipfs,
				account: this.account,
			});
			this.programs = this.programs.filter((f) => f.hash !== programHash);
			await this.publishAggregate();
			return { success: true, message: 'program deleted' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to delete program' };
		}
	}

	public async updateProgramName(concernedProgram: IPCProgram, newName: string): Promise<ResponseType> {
		try {
			this.programs = this.programs.map((prog) => {
				if (prog.id === concernedProgram.id) {
					return {
						...prog,
						name: newName,
						logs: [
							...prog.logs,
							{
								action: `Renamed program to ${newName}`,
								date: Date.now(),
							},
						],
					};
				}
				return prog;
			});
			await this.publishAggregate();
			return { success: true, message: 'Program name updated' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to update program name' };
		}
	}

	public async uploadProgram(
		myProgram: IPCProgram,
		uploadFile: File,
		isRedeploy: boolean,
		oldProgramHash: IPCProgram | undefined,
	): Promise<ResponseType> {
		try {
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
				file: uploadFile,
				entrypoint: myProgram.entrypoint,
			});
			const newProgram: IPCProgram = {
				...myProgram,
				hash: programHashPublishProgram.item_hash,
			};

			this.programs.push(newProgram);

			await this.publishAggregate();

			return { success: true, message: 'Program uploaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload program' };
		}
	}
}

export default Computing;
