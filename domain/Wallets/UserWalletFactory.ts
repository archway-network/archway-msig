import Storage from '@/domain/Storage';
import UserWallet from './UserWallet';
import KeplrWallet from './KeplrWallet';
import CosmostationWallet from './CosmostationWallet';
import LeapWallet from './LeapWallet';
import WalletExtensionNotInstalled from './Exceptions/WalletExtensionNotInstalled';
import IWallet from './IWallet';
import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';

import { WalletType } from '@/types/wallets';

const USER_WALLET_TYPE = 'USER_WALLET_TYPE';

class UserWalletFactory {
  private static domListener: (e: any) => Promise<void> | undefined; // this exists to prevent double registration of events listeners
  private static _wallet: IWallet | undefined = undefined;

  static async makeFromCache(externalDomListener?: (currentWallet: IWallet) => Promise<void> | undefined) {
    const cachedWalletType = Storage.get(USER_WALLET_TYPE, true);

    if (!cachedWalletType) return undefined;

    // it's possible user has deleted wallet or connection, so check again and then setup dom listeners
    await UserWalletFactory.setWallet(cachedWalletType, externalDomListener);
    await UserWalletFactory._wallet!.addDomListeners(UserWalletFactory.domListener);

    const accountAddress = await UserWalletFactory._wallet.accountAddress();

    return new UserWallet(
      WalletType[cachedWalletType as keyof typeof WalletType],
      UserWalletFactory._wallet!.offlineSigner,
      accountAddress,
      UserWalletFactory._wallet!.accountName
    );
  }

  static async make(type: WalletType, externalDomListener?: (currentWallet: IWallet) => Promise<void> | undefined) {
    await UserWalletFactory.setWallet(type, externalDomListener);

    const accountAddress = await UserWalletFactory._wallet.accountAddress();
    await UserWalletFactory._wallet.addDomListeners(UserWalletFactory.domListener);

    UserWalletFactory.setStorage(type, accountAddress);

    return new UserWallet(type, UserWalletFactory._wallet.offlineSigner, accountAddress, UserWalletFactory._wallet.accountName);
  }

  static setStorage(type: WalletType, accountAddress: string) {
    Storage.set(USER_WALLET_TYPE, type, true);
  }

  static async setWallet(type: WalletType, externalDomListener?: (currentWallet: IWallet) => Promise<void> | undefined) {
    if (UserWalletFactory._wallet) return;

    UserWalletFactory._wallet = await UserWalletFactory.driver(type, externalDomListener);

    if (!UserWalletFactory._wallet) return undefined;

    await UserWalletFactory.validateWallet(type, UserWalletFactory._wallet);
  }

  static async validateWallet(type: WalletType, wallet: IWallet) {
    if (await wallet.extensionNotInstalled()) {
      UserWalletFactory._wallet = undefined;

      throw new WalletExtensionNotInstalled(type);
    }
  }

  static async disconnect() {
    UserWalletFactory._wallet?.removeDomListeners(UserWalletFactory.domListener);

    await UserWalletFactory._wallet?.disconnect();
    UserWalletFactory._wallet = undefined;

    Storage.remove(USER_WALLET_TYPE);
  }

  static async driver(
    type: WalletType,
    externalDomListener?: (currentWallet: IWallet) => Promise<void> | undefined
  ): Promise<IWallet | undefined> {
    let wallet: IWallet | undefined = undefined;

    if (type === WalletType.KEPLR) {
      wallet = new KeplrWallet();
      await wallet.initWallet();
    } else if (type === WalletType.COSMOSTATION) {
      wallet = new CosmostationWallet();
      await wallet.initWallet();
    } else if (type === WalletType.LEAP) {
      wallet = new LeapWallet();
      await wallet.initWallet();
    }

    // setup dom listener here so it can be removed properly later
    UserWalletFactory.domListener = async e => {
      await wallet.initWallet();
      UserWalletFactory.setStorage(type, await wallet.accountAddress());
      externalDomListener && (await externalDomListener(wallet));
    };

    return wallet;
  }

  static async createOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner | undefined> {
    if (!UserWalletFactory._wallet) return;

    return UserWalletFactory._wallet.createOfflineSigner(chainId);
  }

  static suggestChain(chainInfo: ChainInfo) {
    if (UserWalletFactory._wallet) {
      UserWalletFactory._wallet.suggestChain(chainInfo);
    }
  }
}

export default UserWalletFactory;
