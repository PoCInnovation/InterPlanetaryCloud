export type IPCFile = {
	name: string;
	content: string;
	created_at: number;
};

export type IPCContact = {
	name: string;
	address: string;
	public_key: string;
};

export type ResponseType = {
	success: boolean;
	message: string;
};

export type IPCRSAKey = {
	public_key: string;
	private_key: string;
};
