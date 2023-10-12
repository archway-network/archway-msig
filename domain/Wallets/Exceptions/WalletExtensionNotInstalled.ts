import { WalletType } from '@/types/wallets';

class WalletExtensionNotInstalled extends Error {
  constructor(type: WalletType) {
    super(`${type} Wallet extension not installed.`);
  }
}

export default WalletExtensionNotInstalled;
