import { account } from 'aleph-ts';

export class AuthError extends Error {}

export default class Auth {
	public async logout(): Promise<void> {
		window.localStorage.clear();
	}

	public async signup(username: string): Promise<void> {
		const newAccount = await account.ethereum.newAccount({ name: username });

		console.log(newAccount);

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
	}

	public async login(username: string, mnemonics: string): Promise<void> {
		const importedAccount = await account.ethereum.importAccount({
			mnemonics,
			name: username,
		});
		console.log(importedAccount);
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
		// const token = jwt.sign({ email, password }, JWT_SECRET);
		// window.localStorage.setItem('token', token);
		// return user;
	}
}
