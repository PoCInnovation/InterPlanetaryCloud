import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({req});

    if (!session)
        return res.status(401).json({ error: 'Permission denied' });
    res.status(200).json({ name: session?.user?.name });
}