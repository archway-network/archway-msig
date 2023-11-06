import { SigningArchwayClient } from '@archwayhq/arch3.js';

import { useWalletStore } from '@/store';

export const useSigningClient = (): SigningArchwayClient => {
  const walletStore = useWalletStore();

  if (!walletStore.signingClient) throw new Error("Couldn't connect to network");

  return walletStore.signingClient as SigningArchwayClient;
};
