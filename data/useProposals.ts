import { type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Proposals, Proposal } from '@/domain';
import { type AccountConfig, type Filter, ProposalsFilterTypes, type ProposalsFilterType } from '@/types';

export const useProposals = async (
  defaultFilter: ProposalsFilterType,
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>
): Promise<{
  proposals: Ref<Proposal[] | undefined>;
  loading: Ref<boolean>;
  filters: Filter[];
  selectedFilter: Ref<ProposalsFilterType>;
}> => {
  const selectedFilter = ref(defaultFilter);
  const isWalletConnected = computed(() => !!walletAddress.value);

  const filters: Filter[] = [
    { id: ProposalsFilterTypes.ALL, label: 'All' },
    { id: ProposalsFilterTypes.IN_PROGRESS, label: 'In Progress' },
    { id: ProposalsFilterTypes.TO_EXECUTE, label: 'To Execute' },
    { id: ProposalsFilterTypes.EXECUTED, label: 'Executed' },
    { id: ProposalsFilterTypes.FAILED, label: 'Rejected & Failed' },
  ];

  const { data: proposals, isLoading } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.proposals`, accountId, address: walletAddress }],
    queryFn: Proposals.all,
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoading.value;
  });

  return {
    proposals,
    loading,
    filters,
    selectedFilter,
  };
};
