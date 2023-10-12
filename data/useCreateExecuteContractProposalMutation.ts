import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts } from '@/composables';
import { Transactions, TransactionMessages } from '@/domain';
import { useWalletStore, useTransactionsStore } from '@/store';

import { AccountConfig } from '@/types';

export const useCreateExecuteContractProposalMutation = async (
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>
) => {
  const walletStore = useWalletStore();
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      contractAddress,
      title,
      description,
      msgs,
    }: {
      contractAddress: string;
      title: string;
      description: string;
      msgs: [];
    }) => {
      if (!walletAddress.value) return;

      const transactions = Transactions.make(walletStore?.signingClient as SigningArchwayClient);
      const msg = TransactionMessages.makeExecuteContractProposal(contractAddress, title, description, msgs);
      return transactions.execute(preProposeContractAddress.value, walletAddress.value, msg);
    },

    onMutate: async () => {
      transactionsStore.onStart();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ scope: 'accounts', entity: `account.${accountId}.proposals`, accountId, address: walletAddress }],
      });

      transactionsStore.onSuccess();
    },

    onError: async (error: Error) => {
      transactionsStore.onError(error);
    },
  });

  return { mutate, loading: isLoading };
};
