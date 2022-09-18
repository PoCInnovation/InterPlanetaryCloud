import { Wallet } from 'ethers';

export const mnemonicToPrivateKey = (mnemonic: string): string => Wallet.fromMnemonic(mnemonic).privateKey;
