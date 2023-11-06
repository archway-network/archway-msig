import { ArchwayClient } from '@archwayhq/arch3.js';

import { useWalletStore } from '@/store';

export const useArchwayClient = (): ArchwayClient => {
  const walletStore = useWalletStore();

  if (!walletStore.archwayClient) throw new Error("Couldn't connect to network");

  return walletStore.archwayClient as ArchwayClient;
};
