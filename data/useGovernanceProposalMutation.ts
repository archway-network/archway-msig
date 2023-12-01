import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts, useSigningClient } from '@/composables';
import { Transactions, TransactionMessages, TokenAmount } from '@/domain';
import { useTransactionsStore } from '@/store';

import { AccountConfig, ModuleUpdate, GovernanceProposalType, TreasurySpendBlock } from '@/types';

export const useGovernanceProposalMutation = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const transactionsStore = useTransactionsStore();
  const { mainContractAddress, preProposeContractAddress } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
      deposit,
      type,
      spend,
      parameterChanges,
      upgradePlan,
      authority,
    }: {
      title: string;
      description: string;
      deposit: TokenAmount;
      type: GovernanceProposalType;
      spend?: TreasurySpendBlock[];
      parameterChanges?: ModuleUpdate[];
      upgradePlan?: Record<string, unknown>;
      authority?: string;
    }) => {
      if (!walletAddress.value) return;

      const signingClient = useSigningClient();
      const transactions = Transactions.make(signingClient);
      const msg = TransactionMessages.governanceProposal(
        mainContractAddress.value,
        title,
        description,
        deposit,
        type,
        spend,
        parameterChanges,
        upgradePlan,
        authority
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
