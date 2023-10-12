import { ref } from 'vue';
import { defineStore } from 'pinia';
import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { v4 as uuidv4 } from 'uuid';
import { isOfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';

import { useConfig, useLoading } from '@/composables';
import IWallet from '@/domain/Wallets/IWallet';
import UserWalletFactory from '@/domain/Wallets/UserWalletFactory';
import UserWallet from '@/domain/Wallets/UserWallet';
import WalletConnectionFailed from '@/domain/Wallets/Exceptions/WalletConnectionFailed';

import { WalletType } from '@/types/wallets';

const useWalletStore = defineStore('wallet', () => {
  const { loading, startsLoading, finishesLoading } = useLoading();
  const { chainInfo } = useConfig();

  const wallet = ref<UserWallet | undefined>();
  const address = ref<string | undefined>();
  const signingClient = ref<SigningArchwayClient | undefined>();
  const offlineSigner = ref<OfflineSigner | undefined>();
  const userIsUsingLedger = ref<boolean>(false);
  const walletConnectValue = ref(uuidv4());

  const openWalletConnect = () => (walletConnectValue.value = uuidv4());

  async function init() {
    try {
      startsLoading();

      wallet.value = await UserWalletFactory.makeFromCache(accountUpdateListener);
      if (wallet.value) {
        address.value = wallet.value.address.address;
        signingClient.value = await SigningArchwayClient.connectWithSigner(chainInfo.value.rpc, wallet.value.signer);
        offlineSigner.value = wallet.value.signer;
        userIsUsingLedger.value = !isOfflineDirectSigner(wallet.value.signer);
      }

      finishesLoading();
    } catch (err) {
      console.error(err);
      finishesLoading();
    }
  }

  async function connect(type: WalletType) {
    try {
      const userWallet = await UserWalletFactory.make(type, accountUpdateListener);

      wallet.value = userWallet;
      address.value = wallet.value?.address?.address;
      signingClient.value = await SigningArchwayClient.connectWithSigner(chainInfo.value.rpc, wallet.value.signer);
      offlineSigner.value = wallet.value.signer;
      userIsUsingLedger.value = !isOfflineDirectSigner(wallet.value.signer);
    } catch (e) {
      console.log('useWalletStore.connect error', e);
      throw new WalletConnectionFailed(type);
    }
  }

  async function disconnect() {
    await UserWalletFactory.disconnect();
    wallet.value = undefined;
    address.value = undefined;
    signingClient.value = undefined;
    offlineSigner.value = undefined;
    userIsUsingLedger.value = false;
  }

  async function accountUpdateListener(currentWallet: IWallet) {
    // note: event handling code is with actual Wallet type, this function simply asks to be refreshed
    const strAddress = await currentWallet.accountAddress();

    if (!wallet.value || !strAddress || !currentWallet.accountName) return;

    wallet.value.address = { address: strAddress, shortAddress: wallet.value.truncate(strAddress) };
    wallet.value.accountName = currentWallet.accountName;
    address.value = strAddress;
    signingClient.value = await SigningArchwayClient.connectWithSigner(chainInfo.value.rpc, wallet.value.signer);
    offlineSigner.value = currentWallet.offlineSigner;
    userIsUsingLedger.value = offlineSigner.value ? !isOfflineDirectSigner(offlineSigner.value) : false;
  }

  return {
    address,
    signingClient,
    offlineSigner,
    userIsUsingLedger,
    wallet,
    loading,
    init,
    connect,
    disconnect,
    walletConnectValue,
    openWalletConnect,
  };
});

export default useWalletStore;
