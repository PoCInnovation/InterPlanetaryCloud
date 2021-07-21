class Drive {
    public files: any[];

    constructor() {
        this.files = [];
    }

    public async load() {}

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
