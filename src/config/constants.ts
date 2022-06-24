import * as env from 'env-var';

console.log(process.env.NEXT_PUBLIC_ALEPH_CHANNEL);
export const ALEPH_CHANNEL = env.get('NEXT_PUBLIC_ALEPH_CHANNEL').asString();
