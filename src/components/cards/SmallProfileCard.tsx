import React from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';

import { useUserContext } from '../../contexts/user';

const SmallProfileCard: React.FC = () => {
	const { user } = useUserContext();

	return (
		<div className="bg-white rounded border-gray-300 border shadow p-3 flex items-center">
			<UserCircleIcon className="w-6 h-6 text-blue-700 mr-2" />
			<p className="text-sm text-gray-700">{user.name}</p>
		</div>
	);
};

export default SmallProfileCard;
