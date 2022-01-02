import * as ethers from 'ethers';

export const mnemonicToPrivateKey = (mnemonic: string): string => ethers.Wallet.fromMnemonic(mnemonic).privateKey;
