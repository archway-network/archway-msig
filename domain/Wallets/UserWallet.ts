import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
import { truncateAddress } from '@/utils';

import { type WalletAddres, WalletType } from '@/types/wallets';

interface UserWalletContract {
  type: WalletType;
  address: WalletAddres;
  accountName: string;
}

class UserWallet implements UserWalletContract {
  public address: WalletAddres;
  public accountName: string;

  constructor(public type: WalletType, public signer: OfflineAminoSigner & OfflineDirectSigner, address: string, accountName: string) {
    this.address = { address, shortAddress: this.truncate(address) };
    this.accountName = accountName;
  }

  truncate(address: string) {
    return truncateAddress(address);
  }
}

export default UserWallet;
