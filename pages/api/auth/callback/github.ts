import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Octokit } from "@octokit/rest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const tmpCode = req.query.code;
    if (!tmpCode)
        return res.status(404).json({ msg: 'Code Not Found' });
    const result = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: tmpCode,
            accept: 'json',
        }
    );

    const accessToken: string = result.data.split("=")[1];

    console.log(">",accessToken);

    const octokit = new Octokit({
        // auth: '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',
        auth: accessToken
    });

    console.log(await octokit.request('GET /user/repos', {}).catch(e => console.log(e)));

    res.redirect('/dashboard');
}
