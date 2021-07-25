// @ts-ignore
import IPFS from 'ipfs-http-client';
// @ts-ignore
import OrbitDB from 'orbit-db';

type OrbitStore = {
	// TODO: fix this error
	// eslint-disable-next-line @typescript-eslint/ban-types
	load: () => {};
};

type OrbitKVStore = OrbitStore & {
	get: (key: string) => string | undefined;
	set: (key: string, value: string) => void;
};

type OrbitDocStore = OrbitStore & {
	get: (key: string) => string | undefined;
	set: (key: string, value: string) => void;
};

export class DatabaseError extends Error {}

export class KVStore {
	private store: OrbitKVStore;

	constructor(store: OrbitKVStore) {
		this.store = store;
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async get(key: string) {
		await this.store.load();
		return this.store.get(key);
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async set(key: string, value: string) {
		return this.store.set(key, value);
	}
}

export class DocStore {
	private store: OrbitDocStore;

	constructor(store: OrbitDocStore) {
		this.store = store;
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async get(key: string) {
		await this.store.load();
		return this.store.get(key);
	}
}

export class Database {
	// TODO: select better type
	// eslint-disable-next-line @typescript-eslint/ban-types
	private orbit: { docs: Function; keyvalue: Function } | null;

	constructor() {
		this.orbit = null;
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async init() {
		this.orbit = await OrbitDB.createInstance(IPFS('http://localhost:5001'));
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async makeKVStore(address: string) {
		if (this.orbit === null) {
			throw new DatabaseError('Database has not yet been initialised');
		}
		return new KVStore(await this.orbit.keyvalue(address));
	}

	// TODO: add returned value
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async makeDocStore(address: string) {
		if (this.orbit === null) {
			throw new DatabaseError('Database has not yet been initialised');
		}
		return new DocStore(await this.orbit.docs(address));
	}
}
