import { accounts } from 'aleph-sdk-ts';
import { aggregate, forget, program, store } from 'aleph-sdk-ts/dist/messages';
import { AggregateMessage, ItemType } from 'aleph-sdk-ts/dist/messages/message';
import { DEFAULT_API_V2 } from 'aleph-sdk-ts/dist/global';
import type { AggregateContentType, AggregateType, IPCProgram, ResponseType } from 'types/types';
import fileDownload from 'js-file-download';
import { ALEPH_CHANNEL } from 'config/constants';

import Contact from '../contact'

class Computing {
	public programs: IPCProgram[];

	private readonly account: accounts.ethereum.ETHAccount;

	public contact: Contact;

	constructor(importedAccount: accounts.ethereum.ETHAccount, contactClass: Contact) {
		this.programs = [];
		this.account = importedAccount;
		this.contact = contactClass;
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

	public async delete(programHash: string): Promise<ResponseType> {
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

	public async updateName(concernedProgram: IPCProgram, newName: string): Promise<ResponseType> {
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

	public async upload(
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
			const programFileHash = await store.Publish({
				account: this.account,
				channel: 'TEST',
				fileObject: uploadFile,
				storageEngine: ItemType.storage,
				APIServer: DEFAULT_API_V2
			});
			const newProgram: IPCProgram = {
				...myProgram,
				hash: programFileHash.content.item_hash
			};

			this.programs.push(newProgram);

			await this.publishAggregate();

			return { success: true, message: 'Program uploaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to upload program' };
		}
	}

	public async addToContact(contactAddress: string, mainProgram: IPCProgram): Promise<ResponseType> {
		try {
			const index = this.contact.contacts.findIndex((contact) => contact.address === contactAddress);

			if (index !== -1) {
				if (this.contact.contacts[index].programs.find((pg) => pg.id === mainProgram.id)) {
					return { success: false, message: 'The program is already shared' };
				}
				const newProgram: IPCProgram = {
					...mainProgram,
					logs: [
						...mainProgram.logs,
						{
							action: `Shared program with ${this.contact.contacts[index].name}`,
							date: Date.now(),
						},
					],
				};
				this.contact.contacts[index].programs.push(newProgram);
				this.contact.publishAggregate();
				return { success: true, message: 'Program shared with the contact' };
			}
			return { success: false, message: 'Contact does not exist' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to share the program with the contact' };
		}
	}

	public async download(programToDownload: IPCProgram): Promise<ResponseType> {
		try {
			const programStore = await store.Get({fileHash : programToDownload.hash });

			fileDownload(programStore, programToDownload.name);
			return { success: true, message: 'Program downloaded' };
		} catch (err) {
			console.error(err);
			return { success: false, message: 'Failed to download the program' };
		}
	}
}

export default Computing;
