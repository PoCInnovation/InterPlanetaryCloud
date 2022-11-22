import CryptoJS from 'crypto-js';

const generateFileKey = (): string => CryptoJS.lib.WordArray.random(256 / 8).toString();

export default generateFileKey;
