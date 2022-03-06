export type IPCFile = {
	name: string;
	content: string;
	created_at: number;
};

export type IPCFileContact = {
	hash: string;
	key: string;
};

export type IPCContact = {
	name: string;
	address: string;
	publicKey: string;
	files: IPCFileContact[];
};

export type ResponseType = {
	success: boolean;
	message: string;
};
