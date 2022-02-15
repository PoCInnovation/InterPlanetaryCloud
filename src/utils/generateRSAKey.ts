import { generateKeyPairSync } from 'crypto';

import { IPCRSAKey } from 'types/types';

export const generateRSAKey = (mnemonic: string): IPCRSAKey => {
	const { publicKey, privateKey } = generateKeyPairSync('rsa', {
		modulusLength: 530,
		publicExponent: 0x10101,
		publicKeyEncoding: {
			type: 'pkcs1',
			format: 'der',
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'der',
			cipher: 'aes-192-cbc',
			passphrase: mnemonic,
		},
	});
	return {
		public_key: publicKey.toString('base64'),
		private_key: privateKey.toString('base64'),
	};
};
