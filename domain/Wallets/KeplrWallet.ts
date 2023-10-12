import { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';

import IWallet from './IWallet';
import { useConfig } from '@/composables';
import { retryFor } from '@/utils';

class KeplrWallet extends IWallet {
  async extensionNotInstalled() {
    const extensionInstalled = await retryFor(() => {
      if (!window) throw new Error('Error reading window');
      if (!window?.keplr) throw new Error('Error reading window.keplr');
    });

    return !extensionInstalled;
  }

  async addDomListeners(listener: (e: any) => Promise<void>) {
    window.addEventListener('keplr_keystorechange', listener);
  }

  async removeDomListeners(listener: (e: any) => Promise<void>) {
    window.removeEventListener('keplr_keystorechange', listener);
  }

  async createOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner | undefined> {
    return window.keplr?.getOfflineSignerAuto(chainId);
  }

  async suggestChain(chainInfo: ChainInfo): Promise<void> {
    return window.keplr?.experimentalSuggestChain(chainInfo);
  }

  async initWallet() {
    const { chainInfo } = useConfig();

    await this.suggestChain(chainInfo.value);
    await window.keplr?.enable(chainInfo.value.chainId);

    if (window.keplr) {
      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
          preferNoSetMemo: true,
          disableBalanceCheck: true,
        },
      };
    }

    this._offlineSigner = await this.createOfflineSigner(chainInfo.value.chainId);
    this._accountName = (await window.keplr?.getKey(chainInfo.value.chainId))?.name;
  }

  async accountAddress() {
    if (!this._offlineSigner) return undefined;

    const accounts = await this._offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async disconnect() {
    this._offlineSigner = undefined;
    this._accountName = undefined;
  }
}

export default KeplrWallet;
