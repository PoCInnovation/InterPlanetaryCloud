import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import validate from 'lib/middlewares/validation';
import { compress, programPublish } from 'lib/services/deploy';
import { clone, getProgramName } from 'lib/services/git';

const router = createRouter<NextApiRequest, NextApiResponse>();

const postSchema = Joi.object({
	// eslint-disable-next-line no-useless-escape
	repository: Joi.string().pattern(/((git|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/),
	entrypoint: Joi.string(),
});

router.post(validate({ body: postSchema }), async (req, res) => {
	const { repository, entrypoint } = req.body;
	let itemHash = '';
	await clone(repository).then(async (path: string) => {
		const fileName: string = await compress(path);
		itemHash = await programPublish(fileName, entrypoint);
		// await cleanup(GITCLONE_DIR);
	});
	return res.status(200).json({ name: getProgramName(repository), item_hash: itemHash, entrypoint });
});

export default router.handler();
