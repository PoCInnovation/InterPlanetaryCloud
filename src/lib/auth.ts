import bcrypt from 'bcryptjs';

import User from './user';
import { Database } from './database';

export class AuthError extends Error {}

export default class Auth {
	private db: Database;

	private readonly salt: string;

	constructor(db: Database) {
		this.db = db;
		this.salt = bcrypt.genSaltSync(10);
	}

	public async logout(): Promise<void> {
		window.localStorage.clear();
	}

	public async signup(email: string, password: string): Promise<User> {
		// if (await this.kv.get(email)) {
		// 	throw new AuthError('account already exists');
		// }
		// const userData = await this.db.makeDocStore(`ipc.user.${email}`);
		// const hashedPassword = bcrypt.hashSync(password, this.salt);
		//
		// await userData.put({ _id: email, password: hashedPassword, data: {} });
		// await this.kv.set(email, userData.address);
		//
		// const user = new User();
		// user.email = email;
		// user.password = hashedPassword;
		// const token = jwt.sign({ email, password }, JWT_SECRET);
		// window.localStorage.setItem('token', token);
		// return user;
		return new User();
	}

	public async login(email: string, password: string): Promise<User> {
		// const userId = await this.kv.get(email);
		//
		// if (!userId) {
		// 	throw new AuthError('invalid email or password');
		// }
		// const userDocs = await this.db.makeDocStore(userId);
		// const userData = await userDocs.get(email);
		// const hashedPassword = userData[0].password;
		//
		// if (!bcrypt.compareSync(password, hashedPassword)) {
		// 	throw new AuthError('invalid email or password');
		// }
		// const user = new User();
		// user.email = email;
		// user.password = hashedPassword;
		// // TODO: Load drive
		// const token = jwt.sign({ email, password }, JWT_SECRET);
		// window.localStorage.setItem('token', token);
		// return user;
		return new User();
	}
}
