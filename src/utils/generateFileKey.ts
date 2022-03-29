import CryptoJS from 'crypto-js';

export const generateFileKey = (): string => CryptoJS.lib.WordArray.random(256 / 8).toString();
