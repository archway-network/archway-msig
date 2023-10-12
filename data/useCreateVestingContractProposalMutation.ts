import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useContracts } from '@/composables';
import { Transactions, TransactionMessages, TokenAmount } from '@/domain';
import { useWalletStore, useTransactionsStore } from '@/store';

import { AccountConfig } from '@/types';

export const useCreateVestingContractProposalMutation = async (
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>
) => {
  const walletStore = useWalletStore();
  const transactionsStore = useTransactionsStore();
  const { preProposeContractAddress, vestingCodeId, vestingDeployerContract } = useContracts(accountId);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
      receiverAddress,
      clawbackAddress,
      amount,
      totalVestingDuration,
      cliffDuration,
      cliffPercentage,
      canStake,
      liquidStaking,
    }: {
      title: string;
      description: string;
      receiverAddress: string;
      clawbackAddress?: string;
      amount: TokenAmount;
      totalVestingDuration: number;
      cliffDuration: number;
      cliffPercentage: number;
      canStake: boolean;
      liquidStaking: boolean;
    }) => {
      if (!walletAddress.value || !vestingCodeId.value || !vestingDeployerContract.value ) return;

      const transactions = Transactions.make(walletStore?.signingClient as SigningArchwayClient);
      const msg = TransactionMessages.makeCreateVestingContractProposal(vestingDeployerContract.value, title, description, {
        receiverAddress,
        clawbackAddress,
        amount,
        totalVestingDuration,
        cliffDuration,
        cliffPercentage,
        canStake,
        liquidStaking,
        vestingCodeId: vestingCodeId.value,
      });
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
