// @ts-ignore
import IPFS from "ipfs-http-client";
// @ts-ignore
import OrbitDB from "orbit-db";

export default class Database {
    public orbit: any | null;
    public ipfs: any | null;

    constructor() {
        this.ipfs = null;
        this.orbit = null;
    }

    public async init() {
        this.ipfs = IPFS("http://localhost:5001");
        this.orbit = await OrbitDB.createInstance(this.ipfs);
    }
};