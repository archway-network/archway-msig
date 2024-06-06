import { type DefineComponent } from 'vue';

export type Wallet = {
  id: WalletType;
  name: string;
  icon: DefineComponent<{}, {}, any>;
  troubleshootUrl?: string;
};

export type WalletAddres = {
  address: string;
  shortAddress: string;
};

export enum WalletType {
  KEPLR = 'KEPLR',
  COSMOSTATION = 'COSMOSTATION',
  LEAP = 'LEAP',
  FALCON = 'FALCON',
  WALLET_CONNECT = 'WALLET_CONNECT',
}
