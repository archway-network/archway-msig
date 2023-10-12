import { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';

import { retryFor } from '@/utils';
import { useConfig } from '@/composables';
import IWallet from './IWallet';

export default class CosmostationWallet extends IWallet {
  private _event: any;

  async extensionNotInstalled(): Promise<boolean> {
    const extensionInstalled = await retryFor(() => {
      if (!window) throw new Error('Error reading window');
      if (!window.cosmostation?.providers?.keplr) throw new Error('Error reading window.cosmostation');
    });

    return !extensionInstalled;
  }

  async addDomListeners(listener: (e: any) => Promise<void>) {
    this._event = window.cosmostation.cosmos.on('accountChanged', listener);
  }

  async removeDomListeners(listener: (e: any) => Promise<void>) {
    window.cosmostation.cosmos.off(this._event);
    this._event = null;
  }

  async createOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner | undefined> {
    return window.cosmostation.providers.keplr.getOfflineSignerAuto(chainId);
  }

  async suggestChain(chainInfo: ChainInfo): Promise<void> {
    return window.cosmostation.providers.keplr.experimentalSuggestChain(chainInfo);
  }

  async initWallet() {
    const { chainInfo } = useConfig();
    const chainInfoVal = chainInfo.value;

    await this.suggestChain(chainInfo.value);
    await window.cosmostation.providers.keplr.enable(chainInfoVal.chainId);

    if (window.cosmostation.providers.keplr) {
      window.cosmostation.providers.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
          preferNoSetMemo: true,
          disableBalanceCheck: true,
        },
      };
    }

    this._offlineSigner = await this.createOfflineSigner(chainInfoVal.chainId);
    this._accountName = (await window.cosmostation.providers.keplr.getKey(chainInfo.value.chainId)).name;
  }

  async accountAddress() {
    if (!this._offlineSigner) return undefined;

    const accounts = await this._offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async disconnect() {
    await window.cosmostation.cosmos.request({
      method: 'cos_disconnect',
    });
    this._offlineSigner = undefined;
    this._accountName = undefined;
  }
}
