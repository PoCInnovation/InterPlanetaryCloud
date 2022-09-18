import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession({ req });

	if (!session) return res.status(401).json({ error: 'Permission denied' });
	const userInfo = await axios.get('https://api.github.com/user', {
		headers: {
			Authorization: `token ${session.accessToken}`,
		},
	});
	if (userInfo.status !== 200) return res.status(userInfo.status).json({ error: userInfo.statusText });

	const userRepos = await axios.get('https://api.github.com/user/repos', {
		headers: {
			Authorization: `token ${session.accessToken}`,
		},
	});
	if (userRepos.status !== 200) return res.status(userRepos.status).json({ error: userRepos.statusText });
	return res.status(200).json(userRepos.data);
};
