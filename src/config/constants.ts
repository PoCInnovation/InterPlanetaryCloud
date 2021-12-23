import * as env from 'env-var';

export const ALEPH_CHANNEL = env.get('REACT_APP_ALEPH_CHANNEL').required().asString();
