import { useQuery } from '@tanstack/vue-query';
import { useArchwayClient, useContracts } from '@/composables';

import { AccountVotingConfiguration } from '@/domain';
import { AccountConfig } from '@/types';

export const useAccountVotingConfiguration = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const { proposalsContractAddress } = useContracts(accountId);
  const isWalletConnected = computed(() => !!walletAddress);

  const { data: votingConfiguration, isLoading: isLoadingAccountVotingConfig } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.votingConfig` }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client.queryContractSmart(proposalsContractAddress.value, { config: {} }).then(data => AccountVotingConfiguration.make(data));
    },
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoadingAccountVotingConfig.value;
  });

  return { votingConfiguration, loading };
};
