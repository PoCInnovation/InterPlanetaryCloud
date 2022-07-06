if (!process.env.NEXT_PUBLIC_ALEPH_CHANNEL) throw new Error('NEXT_PUBLIC_ALEPH_CHANNEL env variable must be set');

export const ALEPH_CHANNEL = process.env.NEXT_PUBLIC_ALEPH_CHANNEL;
