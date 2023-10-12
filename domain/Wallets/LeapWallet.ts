import { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';

import IWallet from './IWallet';
import { retryFor } from '@/utils';
import { useConfig } from '@/composables';

export default class LeapWallet extends IWallet {
  async extensionNotInstalled(): Promise<boolean> {
    const extensionInstalled = await retryFor(() => {
      if (!window) throw new Error('Error reading window');
      if (!window?.leap) throw new Error('Error reading window.leap');
    });

    return !extensionInstalled;
  }

  async addDomListeners(listener: (e: any) => Promise<void>) {
    window.addEventListener('leap_keystorechange', listener);
  }

  async removeDomListeners(listener: (e: any) => Promise<void>) {
    window.removeEventListener('leap_keystorechange', listener);
  }

  async createOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner | undefined> {
    return window.leap?.getOfflineSignerAuto(chainId);
  }

  async suggestChain(chainInfo: ChainInfo): Promise<void> {
    return window.leap?.experimentalSuggestChain(chainInfo);
  }

  async initWallet() {
    const { chainInfo } = useConfig();
    const chainInfoVal = chainInfo.value;

    await this.suggestChain(chainInfoVal);
    await window.leap.enable(chainInfoVal.chainId);

    if (window.leap?.defaultOptions) {
      window.leap.defaultOptions = {
        sign: {
          preferNoSetFee: true,
          preferNoSetMemo: true,
          disableBalanceCheck: true,
        },
      };
    }

    this._offlineSigner = await this.createOfflineSigner(chainInfoVal.chainId);
    this._accountName = (await window.leap?.getKey(chainInfo.value.chainId)).name;
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
