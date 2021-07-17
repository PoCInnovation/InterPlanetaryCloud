import User from "./user";
import Database from "./database";

export default class Auth {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async logout() {}

    public async signup(email: string, password: string): Promise<User> {
        return new User(new Database(), "", "");
    }

    public async login(token: string): Promise<User> {
        return new User(new Database(), "", "");
    }
};
