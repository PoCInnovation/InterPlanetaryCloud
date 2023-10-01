import z from 'zod';

import deploy from 'lib/services/deploy';
import {clone, getProgramName} from 'lib/services/git';
import {NextApiRequest, NextApiResponse} from 'next';

const postSchema = z.object({
    // eslint-disable-next-line no-useless-escape
    repository: z.string().regex(/((git|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/),
    entrypoint: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') throw new Error('Method not allowed');
        const body = postSchema.parse(req.body);
        const {repository, entrypoint} = body;
        const path = await clone(repository);
        const itemHash = await deploy(path, entrypoint);
        return res.status(200).json({name: getProgramName(repository), item_hash: itemHash, entrypoint});
    } catch (error) {
        return res.status(400).end('Bad request');
    }
}
