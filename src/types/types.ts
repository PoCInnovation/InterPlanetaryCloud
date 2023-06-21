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
	logs: Log[];
};

export type IPCFolder = {
	name: string;
	createdAt: number;
	path: string;
	logs: Log[];
};

export type Log = {
	action: string;
	date: number;
};

export type IPCProgram = {
	id: string;
	hash: string;
	name: string;
	createdAt: number;
	entrypoint: string;
	permission: IPCPermission;
	size: number;
	logs: Log[];
};

export type IPCConfig = {
	[key: string]: {
		name: string;
		value: string;
	} & (
		| {
				type: 'input';
		  }
		| {
				type: 'select';
				options: string[];
		  }
	);
};

export type IPCContact = {
	name: string;
	address: string;
	publicKey: string;
	createdAt: number;
	files: IPCFile[];
	folders: IPCFolder[];
	config?: IPCConfig;
	programs: IPCProgram[];
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
	owner: {
		login: string;
	};
	html_url: string;
};
