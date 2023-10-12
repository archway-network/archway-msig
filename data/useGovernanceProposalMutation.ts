import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts } from '@/composables';
import { Transactions, TransactionMessages, TokenAmount } from '@/domain';
import { useWalletStore, useTransactionsStore } from '@/store';

import { AccountConfig, ChainParameter, GovernanceProposalType, TreasurySpendBlock } from '@/types';

export const useGovernanceProposalMutation = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const walletStore = useWalletStore();
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
    }: {
      title: string;
      description: string;
      deposit: TokenAmount;
      type: GovernanceProposalType;
      spend?: TreasurySpendBlock[];
      parameterChanges?: ChainParameter[];
      upgradePlan?: Record<string, unknown>;
    }) => {
      if (!walletAddress.value) return;

      const transactions = Transactions.make(walletStore?.signingClient as SigningArchwayClient);
      const msg = TransactionMessages.governanceProposal(mainContractAddress.value, title, description, deposit, type, spend, parameterChanges, upgradePlan);
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
