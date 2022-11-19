import { Wallet } from 'ethers';

const mnemonicToPrivateKey = (mnemonic: string): string => Wallet.fromMnemonic(mnemonic).privateKey;

export default mnemonicToPrivateKey;
