import { Encrypted } from 'eth-crypto';

export type IPCFile = {
	hash: string;
	key: Encrypted;
	name: string;
	created_at: number;
};

export type IPCProgram = {
	hash: string;
	name: string;
	created_at: number;
};

export type IPCContact = {
	name: string;
	address: string;
	publicKey: string;
	files: IPCFile[];
};

export type ResponseType = {
	success: boolean;
	message: string;
};

export type UploadResponse = ResponseType & {
	file?: IPCFile;
};

export type AggregateContentType = {
	programs: IPCProgram[];
	contacts: IPCContact[];
};

export type AggregateType = {
	InterPlanetaryCloud: AggregateContentType;
};

export type GitHubRepository = {
	name: string;
	html_url: string;
};
