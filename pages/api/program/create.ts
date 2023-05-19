import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import validate from 'lib/middlewares/validation';
import deploy from 'lib/services/deploy';
import { clone, getProgramName } from 'lib/services/git';

const router = createRouter<NextApiRequest, NextApiResponse>();

const postSchema = Joi.object({
	// eslint-disable-next-line no-useless-escape
	repository: Joi.string().pattern(/((git|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/),
	entrypoint: Joi.string(),
});

router.post(validate({ body: postSchema }), async (req, res) => {
	const { repository, entrypoint } = req.body;
	const path = await clone(repository);
	const itemHash = await deploy(path, entrypoint);
	return res.status(200).json({ name: getProgramName(repository), item_hash: itemHash, entrypoint });
});

export default router.handler();
