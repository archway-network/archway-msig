import { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Proposals, ProposalVote } from '@/domain';
import { AccountConfig, ProposalId } from '@/types';

export const useProposalVotes = async (
  accountId: AccountConfig.AccountId,
  proposalId: ProposalId,
  walletAddress: ComputedRef<string | undefined>
): Promise<{
  proposalVotes: Ref<ProposalVote[] | undefined>;
  loading: Ref<boolean>;
}> => {
  const isWalletConnected = computed(() => !!walletAddress.value);

  const { data: proposalVotes, isLoading } = useQuery({
    queryKey: [
      { scope: 'accounts', entity: `account.${accountId}.proposals.${proposalId}.votes`, accountId, proposalId, address: walletAddress },
    ],
    queryFn: Proposals.votesFor,
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoading.value;
  });

  return { proposalVotes, loading };
};
