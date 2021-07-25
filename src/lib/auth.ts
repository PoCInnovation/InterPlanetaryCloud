import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './user';
import { Database, KVStore } from './database';

import { JWT_SECRET } from '../config/environment';

export class AuthError extends Error {}

export default class Auth {
	private db: Database;

	private kv: KVStore;

	private readonly salt: string;

	constructor(db: Database, kv: KVStore) {
		this.db = db;
		this.kv = kv;
		this.salt = bcrypt.genSaltSync(10);
	}

	// TODO: add return type
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async logout() {
		window.localStorage.clear();
	}

	public async signup(email: string, password: string): Promise<User> {
		if (await this.kv.get(email)) {
			throw new AuthError('account already exists');
		}
		// TODO: use this variable
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const userData = await this.db.makeDocStore(`ipc.user.${email}`);
		const hashedPassword = bcrypt.hashSync(password, this.salt);

		// TODO PUT
		// await this.kv.set(email, { userData.address});

		const user = new User();
		user.email = email;
		user.password = hashedPassword;
		const token = jwt.sign({ email, password }, JWT_SECRET);
		window.localStorage.setItem('token', token);
		return user;
	}

	public async login(email: string, password: string): Promise<User> {
		const userId = await this.kv.get(email);
		if (!userId) {
			throw new AuthError('invalid email or password');
		}
		// TODO: use this variable
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const userData = await this.db.makeDocStore(userId);
		// TODO: fix this error
		// const hashedPassword = await userData.get(email)[0].password;
		const hashedPassword = '';
		if (!bcrypt.compareSync(password, hashedPassword)) {
			throw new AuthError('invalid email or password');
		}
		const user = new User();
		user.email = email;
		user.password = hashedPassword;
		// TODO: Load drive
		const token = jwt.sign({ email, password }, JWT_SECRET);
		window.localStorage.setItem('token', token);
		return user;
	}
}
