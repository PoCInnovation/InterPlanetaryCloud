if (!process.env.NEXT_GITCLONE_DIR) throw new Error('NEXT_GITCLONE_DIR env variable must be set');
if (!process.env.NEXT_PUBLIC_ALEPH_CHANNEL) throw new Error('NEXT_PUBLIC_ALEPH_CHANNEL env variable must be set');

export const ALEPH_CHANNEL = process.env.NEXT_PUBLIC_ALEPH_CHANNEL;
export const GITCLONE_DIR = process.env.NEXT_GITCLONE_DIR;
