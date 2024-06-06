import { type ComputedRef } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts, useSigningClient } from '@/composables';
import { Transactions, TransactionMessages, VestingAccount } from '@/domain';
import { useTransactionsStore } from '@/store';

import { type AccountConfig } from '@/types';

export const useVestingAccountClawbackMutation = async (
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>
) => {
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      vestingAccount,
      finalizeClawback,
      title,
      description,
    }: {
      vestingAccount: VestingAccount;
      finalizeClawback: boolean;
      title: string;
      description: string;
    }) => {
      if (!walletAddress.value) return;

      const signingClient = useSigningClient();
      const transactions = Transactions.make(signingClient);
      const msg = TransactionMessages.vestingClawbackProposal(vestingAccount.id, title, description, finalizeClawback);
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
