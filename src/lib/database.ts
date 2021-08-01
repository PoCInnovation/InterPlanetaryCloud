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
	// eslint-disable-next-line
	get: (key: string) => any | undefined;
	put: (value: unknown) => void;
	address: string;
};

export class DatabaseError extends Error {}

export class KVStore {
	private store: OrbitKVStore;

	constructor(store: OrbitKVStore) {
		this.store = store;
	}

	public async get(key: string): Promise<string | undefined> {
		await this.store.load();
		return this.store.get(key);
	}

	public async set(key: string, value: string): Promise<void> {
		return this.store.set(key, value);
	}
}

export class DocStore {
	private store: OrbitDocStore;

	public address: string;

	constructor(store: OrbitDocStore) {
		this.store = store;
		this.address = store.address;
	}

	// eslint-disable-next-line
	public async get(key: string): Promise<any> {
		await this.store.load();
		return this.store.get(key);
	}

	public async put(value: unknown): Promise<void> {
		return this.store.put(value);
	}
}

export class Database {
	// eslint-disable-next-line
	private orbit: any | null;

	constructor() {
		this.orbit = null;
	}

	public async init(): Promise<void> {
		this.orbit = await OrbitDB.createInstance(IPFS('http://localhost:5001'));
	}

	public async makeKVStore(address: string): Promise<KVStore> {
		if (this.orbit === null) {
			throw new DatabaseError('Database has not yet been initialised');
		}
		return new KVStore(await this.orbit.keyvalue(address));
	}

	public async makeDocStore(address: string): Promise<DocStore> {
		if (this.orbit === null) {
			throw new DatabaseError('Database has not yet been initialised');
		}
		return new DocStore(await this.orbit.docs(address));
	}
}
