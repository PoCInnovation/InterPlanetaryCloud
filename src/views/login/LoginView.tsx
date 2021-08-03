/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { AuthError } from '../../lib/auth';
import { useAuthContext } from '../../contexts/auth';

const LoginView: React.FC = () => {
	const [username, setUsername] = React.useState('');
	const [mnemonics, setMnemonics] = React.useState('');
	const auth = useAuthContext();

	const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
	const mnemonicsChange = (e: React.ChangeEvent<HTMLInputElement>) => setMnemonics(e.target.value);

	const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		auth.login(username, mnemonics).catch((error: AuthError) => {
			console.error(error);
		});
	};

	return (
		<div className="flex items-center justify-center">
			<form onSubmit={loginUser} className="mt-24 bg-white p-6 rounded-md border border-gray-200 w-[400px] shadow-md">
				<div className="">
					<p className="text-xl">Log in</p>
				</div>

				<div className="flex flex-col mt-6">
					<label className="text-sm text-gray-600 mb-1">
						Username
						<input
							className="p-2 text-sm bg-gray-100 border border-gray-300 rounded mb-4"
							onChange={usernameChange}
							type="text"
						/>
					</label>
					<label className="text-sm text-gray-600 mb-1">
						Mnemonics
						<input
							className="p-2 text-sm bg-gray-100 border border-gray-300 rounded"
							onChange={mnemonicsChange}
							type="password"
						/>
					</label>
				</div>
				<div className="flex justify-end mt-6">
					<button
						type="submit"
						className="shadow p-2 px-4 text-sm bg-blue-600 text-white rounded transition duration-200 hover:bg-blue-700"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginView;
