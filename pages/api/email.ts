import { NextApiRequest, NextApiResponse } from 'next';
import { mailOptions, transporter } from '../../src/config/nodemailer';

type BodyEmail = {
	email: string;
	subject: string;
	message: string;
	fileName: string;
	fileContent: string;
	userName: string;
}

const CONTACT_MESSAGE_FIELDS: BodyEmail = {
	email: 'Email',
	subject: 'Subject',
	message: 'Message',
	fileName: 'FileName',
	fileContent: 'FileContent',
	userName: 'UserName',
};

const generateEmailContent = (data: BodyEmail): { text: string, html: string } => {
	const stringData = Object.entries(data).reduce((str: string, [key, val]) => {
		if (CONTACT_MESSAGE_FIELDS[key as keyof BodyEmail]) {
			return `${str}${CONTACT_MESSAGE_FIELDS[key as keyof BodyEmail]}: \n${val} \n \n`;
		}
		return str;
	}, '');

	return {
		text: stringData,
		html: `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Email Template</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #f4f4f4;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(90deg, #0074D9 0%, #FF4136 100%);
            color: white;
        }

        h1 {
            font-size: 24px;
        }

        p {
            font-size: 16px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>Hello,</h1>
        <p>${data.userName} sent you 
            ${data.message ? 'the following message:' : 'a file without a message.'}
        </p>
        ${data.message ? `<p>${data.message}</p>` : ''}
    </div>
</body>
</html>
`,
	};
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.method === 'POST') {
		const data = req.body;
		if (!data || !data.email) {
			return res.status(400).send({ message: 'Bad request' });
		}

		try {
			mailOptions.to = data.email;
			if (data.fileContent) {
				mailOptions.attachments = [
					{
						filename: data.fileName,
						content: data.fileContent,
					},
				];
			}
			await transporter.sendMail({
				...mailOptions,
				...generateEmailContent(data),
				subject: data.subject,
			});

			return res.status(200).json({ success: true });
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
		} catch (err: Error) {
			return res.status(400).json({ message: err.message });
		}
	}
	if (req.method === 'GET') {
		return res.status(200).json({ success: 'Bien vu' });
	}
	return res.status(200).json({ success: 'Bien return' });
};
