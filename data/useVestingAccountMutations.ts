import { ComputedRef } from 'vue';
import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts } from '@/composables';
import { Transactions, TransactionMessages } from '@/domain';
import { useWalletStore, useTransactionsStore } from '@/store';

import { AccountConfig } from '@/types';

export const useVestingAccountMutations = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const walletStore = useWalletStore();
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (msg: any) => {
      if (!walletAddress.value) return;

      const transactions = Transactions.make(walletStore?.signingClient as SigningArchwayClient);
      return transactions.execute(preProposeContractAddress.value, walletAddress.value, msg);
    },

    onMutate: async () => {
      transactionsStore.onStart();
    },

    onSuccess: result => {
      queryClient.invalidateQueries({
        queryKey: [{ scope: 'accounts', entity: `account.${accountId}.proposals`, accountId, address: walletAddress }],
      });

      transactionsStore.onSuccess(result?.transactionHash);
    },

    onError: async (error: Error) => {
      transactionsStore.onError(error);
    },
  });

  return { mutate, loading: isLoading };
};
