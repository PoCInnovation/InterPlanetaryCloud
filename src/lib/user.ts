import Database from "./database";

class Drive {
    constructor(database: Database) {}

    public async fetch() {}

    public async post() {}
};

export default class User {
    public email: string | null;
    public password: string | null;
    public drive: Drive;

    constructor(database: Database, email: string, password: string) {
        this.drive = new Drive(database);
        this.email = email;
        this.password = password;
    }
};