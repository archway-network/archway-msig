import { type ComputedRef } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts, useSigningClient } from '@/composables';
import { Transactions, TransactionMessages } from '@/domain';
import { useTransactionsStore } from '@/store';

import type { AccountConfig, BulkDelegationBlock } from '@/types';

export const useBulkStakingMutation = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
      delegations,
      undelegations,
    }: {
      title: string;
      description: string;
      delegations: BulkDelegationBlock[];
      undelegations: BulkDelegationBlock[];
    }) => {
      if (!walletAddress.value) return;

      const signingClient = useSigningClient();
      const transactions = Transactions.make(signingClient);
      const msg = TransactionMessages.bulkStakingProposal(title, description, delegations, undelegations);
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
