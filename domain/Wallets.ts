import BrandKeplr from '@/components/Ui/Icons/BrandKeplr.vue';
import BrandCosmostation from '@/components/Ui/Icons/BrandCosmostation.vue';
import BrandLeap from '@/components/Ui/Icons/BrandLeap.vue';

import { Wallet, WalletType } from '@/types/wallets';

const keplrWallet = { id: WalletType.KEPLR, name: 'Keplr', icon: BrandKeplr, troubleshootUrl: 'https://help.keplr.app/en/getting-started' };
const cosmostationWallet = {
  id: WalletType.COSMOSTATION,
  name: 'Cosmostation',
  icon: BrandCosmostation,
  troubleshootUrl: 'https://guide.cosmostation.io/web_wallet_en.html',
};
const leapWallet = {
  id: WalletType.LEAP,
  name: 'Leap',
  icon: BrandLeap,
  troubleshootUrl: 'https://leapwallet.notion.site/Leap-Cosmos-Wallet-Support-ba1da3c05d3341eaa44a1850ed3260ee',
};

class Wallets {
  static all(): Wallet[] {
    return [keplrWallet, cosmostationWallet, leapWallet];
  }

  static find(id?: WalletType): Wallet | undefined {
    return Wallets.all().find(wallet => wallet.id === id);
  }
}

export default Wallets;
