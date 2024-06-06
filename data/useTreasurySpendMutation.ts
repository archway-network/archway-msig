import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts, useSigningClient } from '@/composables';
import { Transactions, TransactionMessages } from '@/domain';
import { useTransactionsStore } from '@/store';

import type { AccountConfig, TreasurySpendBlock } from '@/types';

export const useTreasurySpendMutation = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ title, description, spend }: { title: string; description: string; spend: TreasurySpendBlock[] }) => {
      if (!walletAddress.value) return;

      const signingClient = useSigningClient();
      const transactions = Transactions.make(signingClient);
      const msg = TransactionMessages.treasurySpendProposal(title, description, spend);
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
