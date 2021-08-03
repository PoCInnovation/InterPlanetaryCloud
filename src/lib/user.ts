// class Drive {
// 	public files: unknown[];

// 	constructor() {
// 		this.files = [];
// 	}

// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
// 	public async load() {}

// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
// 	public async add() {}
// }

export default class User {
	public name: string | null;

	constructor(name: string) {
		this.name = name;
	}
}
