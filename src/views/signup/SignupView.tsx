/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useAuthContext } from '../../contexts/auth';

const SignupView: React.FC = () => {
	const [username, setUsername] = React.useState('');
	const [mnemonics, setMnemonics] = React.useState('Click register to see your mnemonics');
	const auth = useAuthContext();

	const signupUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const signup = await auth.signup(username);
			if (signup) setMnemonics(signup);
			// TODO: ajouter retour utilisateur
			else console.log('Please try again');
		} catch {
			// TODO: ajouter retour utilisateur
			console.error('Please try again');
		}
	};

	return (
		<div className="flex items-center justify-center">
			<form
				onSubmit={(e) => signupUser(e)}
				className="mt-24 bg-white p-6 rounded-md border border-gray-200 w-[400px] shadow-md"
			>
				<div className="">
					<p className="text-xl">Sign up</p>
				</div>
				<div className="flex flex-col mt-6">
					<label form="username" className="text-sm text-gray-600 mb-1">
						Username
					</label>
					<input
						className="p-2 text-sm bg-gray-100 border border-gray-300 rounded mb-4"
						onChange={(e) => setUsername(e.target.value)}
						type="text"
					/>
				</div>
				<div className="flex flex-col mt-6 h-32">
					<label className="text-sm text-gray-600 mb-1">Mnemonics</label>
					<textarea
						className="select-all h-full cursor-text p-2 text-sm bg-gray-100 border border-gray-300 rounded mb-4"
						value={mnemonics}
						disabled
					/>
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

export default SignupView;
