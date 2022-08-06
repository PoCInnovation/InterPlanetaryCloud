import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Joi from 'joi';
import validate from 'lib/middlewares/validation';
import { clone } from 'lib/services/git';
// import { clone, cleanup } from 'lib/services/git'; for future use
import { compress } from 'lib/services/deploy';

const router = createRouter<NextApiRequest, NextApiResponse>();

const postSchema = Joi.object({
	// eslint-disable-next-line no-useless-escape
	repository: Joi.string().pattern(/((git|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/),
});

router.post(validate({ body: postSchema }), async (req, res) => {
	const { repository } = req.body;
	clone(repository).then(async (path: string) => {
		await compress(path);
		// deploy
		// cleanup(path);
	});
	return res.status(200).end(`Deploying repository ${repository}`);
});

export default router.handler();
