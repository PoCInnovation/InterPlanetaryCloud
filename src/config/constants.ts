import * as env from 'env-var';

export const ALEPH_CHANNEL = env.get('NEXT_PUBLIC_ALEPH_CHANNEL').asString();
