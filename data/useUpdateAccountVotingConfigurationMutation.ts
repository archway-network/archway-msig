import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts, useSigningClient } from '@/composables';
import { Transactions, TransactionMessages } from '@/domain';
import { useTransactionsStore } from '@/store';

import { type AccountConfig } from '@/types';

export const useUpdateAccountVotingConfigurationMutation = async (
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>
) => {
  const transactionsStore = useTransactionsStore();
  const { mainContractAddress, preProposeContractAddress, proposalsContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
      passingThresholdMajority,
      passingThreshold,
      quorumEnabled,
      quorumThresholdMajority,
      quorumThreshold,
      votingDuration,
      allowRevoting,
    }: {
      title: string;
      description: string;
      passingThresholdMajority: boolean;
      passingThreshold: string;
      quorumEnabled: boolean;
      quorumThresholdMajority: boolean;
      quorumThreshold: string;
      votingDuration: number;
      allowRevoting: boolean;
    }) => {
      if (!walletAddress.value) return;

      const signingClient = useSigningClient();
      const transactions = Transactions.make(signingClient);
      const msg = TransactionMessages.updateAccountVotingConfigurationProposal(
        proposalsContractAddress.value,
        mainContractAddress.value,
        title,
        description,
        passingThresholdMajority,
        passingThreshold,
        quorumEnabled,
        quorumThresholdMajority,
        quorumThreshold,
        votingDuration,
        allowRevoting
      );
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
