import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Joi from 'joi';
import validate from 'lib/middlewares/validation';
import { clone, cleanup } from 'lib/services/git';

const router = createRouter<NextApiRequest, NextApiResponse>();

const postSchema = Joi.object({
	// eslint-disable-next-line no-useless-escape
	repository: Joi.string().pattern(/((git|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/),
});

router.post(validate({ body: postSchema }), async (req, res) => {
	const { repository } = req.body;
	clone(repository).then((path: string) => {
		// TODO: launch deploy and then cleanup
		// cleanup(path);
	});
	return res.status(200).end(`Deploying repository ${repository}`);
});

export default router.handler();
