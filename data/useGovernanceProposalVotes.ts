import { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { GovernanceProposals, GovernanceProposalVotes } from '@/domain';
import { GovernanceProposalId } from '@/types';

export const useGovernanceProposalVotes = async (
  proposalId: GovernanceProposalId,
  inProgress: boolean = false
): Promise<{
  proposalVotes: Ref<GovernanceProposalVotes | undefined>;
  loading: Ref<boolean>;
}> => {
  const { data: proposalVotes, isLoading } = useQuery({
    queryKey: [{ scope: 'proposals', entity: 'details.tally', proposalId }],
    queryFn: GovernanceProposals.votesTallyFor,
    staleTime: inProgress ? 1000 * 60 : Infinity,
  });

  return {
    proposalVotes,
    loading: isLoading,
  };
};
