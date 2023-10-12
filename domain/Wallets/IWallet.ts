import { OfflineAminoSigner, OfflineDirectSigner, Keplr } from '@keplr-wallet/types';

// Wallet should implement it's own code for these methods
// todo: may need a wallet type field for downstream or future code
export default abstract class IWallet {
  protected _accountName: string | undefined;
  protected _offlineSigner: OfflineAminoSigner | OfflineDirectSigner | undefined;

  public get accountName(): string | undefined {
    return this._accountName;
  }

  public get offlineSigner(): OfflineAminoSigner | OfflineDirectSigner | undefined {
    return this._offlineSigner;
  }

  abstract extensionNotInstalled(): Promise<boolean>;

  // create event handlers to react to changes in wallet state
  // todo: needs some tests around what happens if user switches to a diff wallet during same session
  // note: this function sig may change as more unique wallets are added
  abstract addDomListeners(listener: (e: any) => Promise<void>): Promise<void>;
  abstract removeDomListeners(listener: (e: any) => Promise<void>): Promise<void>;

  // Receive a chainId and return an offline signer for that network
  abstract createOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner | undefined>;

  // Suggest a chain to the wallet extension
  abstract suggestChain(chainInfo: ChainInfo): Promise<void>;

  // do the things wallet needs to start up
  abstract initWallet(): Promise<void>;

  abstract accountAddress(): Promise<string | undefined>;

  // note: not all wallets need a disconnect, if your wallet does not implement this call as empty
  abstract disconnect(): Promise<void>;
}
