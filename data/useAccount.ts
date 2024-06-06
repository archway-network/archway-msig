import { useQuery } from '@tanstack/vue-query';
import { useArchwayClient, useContracts } from '@/composables';

import { Account, Member } from '@/domain';
import { type AccountConfig } from '@/types';

export const useAccount = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const { mainContractAddress, proposalsContractAddress, membersContractAddress } = useContracts(accountId);
  const isWalletConnected = computed(() => !!walletAddress.value);

  const { data: account, isLoading: isLoadingAccountConfig } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.config`, address: walletAddress }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client.queryContractSmart(mainContractAddress.value, { config: {} }).then(data => Account.make(accountId, data));
    },
    enabled: isWalletConnected,
  });

  const { data: totalProposals, isLoading: isLoadingTotalProposals } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.proposals.total`, address: walletAddress }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client.queryContractSmart(proposalsContractAddress.value, { proposal_count: {} });
    },
    enabled: isWalletConnected,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.members`, address: walletAddress }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client
        .queryContractSmart(membersContractAddress.value, { list_members: {} })
        .then(({ members }) => (members || []).map((attributes: any) => Member.make(attributes)));
    },
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoadingAccountConfig.value || isLoadingTotalProposals.value || isLoadingMembers.value;
  });

  return { account, members, totalProposals, loading };
};
