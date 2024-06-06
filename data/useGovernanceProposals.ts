import { type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { GovernanceProposals, GovernanceProposal } from '@/domain';

import { type Filter, GovernanceProposalsFilterTypes, type GovernanceProposalsFilterType } from '@/types';

export const useGovernanceProposals = async (
  defaultFilter: GovernanceProposalsFilterType
): Promise<{
  proposals: Ref<GovernanceProposal[] | undefined>;
  loading: Ref<boolean>;
  filters: Filter[];
  selectedFilter: Ref<GovernanceProposalsFilterType>;
}> => {
  const selectedFilter = ref(defaultFilter);

  const filters: Filter[] = [
    { id: GovernanceProposalsFilterTypes.ALL, label: 'All' },
    { id: GovernanceProposalsFilterTypes.IN_PROGRESS, label: 'Voting' },
    { id: GovernanceProposalsFilterTypes.PASSED, label: 'Passed' },
    { id: GovernanceProposalsFilterTypes.DEPOSIT_PERIOD, label: 'Deposit Period' },
    { id: GovernanceProposalsFilterTypes.REJECTED, label: 'Rejected' },
    { id: GovernanceProposalsFilterTypes.FAILED, label: 'Failed' },
  ];

  const { data, isLoading } = useQuery({
    queryKey: [{ scope: 'proposals', entity: 'index', filter: selectedFilter }],
    queryFn: GovernanceProposals.all,
  });

  return {
    proposals: data,
    loading: isLoading,
    filters,
    selectedFilter,
  };
};
