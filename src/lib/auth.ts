import User from "./user";
import {Database, KVStore} from "./database";

export class AuthError extends Error {}

export default class Auth {
    private db: Database;
    private kv: KVStore;

    constructor(db: Database, kv: KVStore) {
        this.db = db;
        this.kv = kv;
    }

    public async logout() {
        window.localStorage.clear();
    }

    public async signup(email: string, password: string): Promise<User> {
        return new User();
    }

    public async login(email: string, password: string): Promise<User> {
        const id = await this.kv.get(email);
        if (!id) {
            throw new AuthError("no account is linked to this email");
        }

        return new User();
    }
};
