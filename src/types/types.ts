export type IPCFile = {
	id: string;
	hash: string;
	encryptInfos: { key: string; iv: string };
	name: string;
	size: number;
	createdAt: number;
	path: string;
	permission: IPCPermission;
	deletedAt: number | null;
	logs: FileLog[];
};

export type IPCFolder = {
	name: string;
	createdAt: number;
	path: string;
	logs: FileLog[]
};

export type FileLog = {
	action: string
	date: number
}

export type IPCProgram = {
	hash: string;
	name: string;
	createdAt: number;
	entrypoint: string;
};

export type IPCConfig = {
	theme: string;
	defaultEntrypoint: string;
	defaultName: string;
};

export type IPCContact = {
	name: string;
	address: string;
	publicKey: string;
	files: IPCFile[];
	folders: IPCFolder[];
	config: IPCConfig | undefined;
};

export type IPCPermission = 'owner' | 'viewer' | 'editor';

export type IPCUpdateContent = {
	tags: string[];
	file: IPCFile;
};

export type ResponseType = {
	success: boolean;
	message: string;
};

export type ToastResponse = {
	title: string;
	status: 'success' | 'error';
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
