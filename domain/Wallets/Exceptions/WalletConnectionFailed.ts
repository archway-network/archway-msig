import { WalletType } from '@/types/wallets';

class WalletConnectionFailed extends Error {
  constructor(type: WalletType) {
    super(`${type} Wallet connection failed.`);
  }
}

export default WalletConnectionFailed;
