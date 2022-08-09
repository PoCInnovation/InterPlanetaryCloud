if (!process.env.NEXT_PUBLIC_GITCLONE_DIR) throw new Error('NEXT_PUBLIC_GITCLONE_DIR env variable must be set');
if (!process.env.NEXT_PUBLIC_ALEPH_CHANNEL) throw new Error('NEXT_PUBLIC_ALEPH_CHANNEL env variable must be set');
if (!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) throw new Error('NEXT_PUBLIC_GITHUB_CLIENT_ID env variable must be set');
if (!process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET) throw new Error('NEXT_PUBLIC_GITHUB_CLIENT_SECRET env variable must be set');

export const ALEPH_CHANNEL = process.env.NEXT_PUBLIC_ALEPH_CHANNEL;
export const GITCLONE_DIR = process.env.NEXT_PUBLIC_GITCLONE_DIR;
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;
