import nodemailer from 'nodemailer';

const email = process.env.IPC_EMAIL;
const pass = process.env.IPC_EMAIL_PASS;

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: email,
		pass,
	},
});

export const mailOptions = {
	from: email,
	to: '',
};
