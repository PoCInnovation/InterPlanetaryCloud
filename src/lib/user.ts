class Drive {
	public files: unknown[];

	constructor() {
		this.files = [];
	}

	// TODO: implement this function
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async load() {}

	// TODO: implement this function
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async add() {}
}

export default class User {
	public email: string | null;

	public password: string | null;

	public drive: Drive;

	constructor() {
		this.password = null;
		this.email = null;
		this.drive = new Drive();
	}
}
