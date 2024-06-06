import { useQuery } from '@tanstack/vue-query';
import { useArchwayClient, useContracts } from '@/composables';

import { type AccountConfig } from '@/types';

export const useVestingAccountId = async (
  accountId: ComputedRef<AccountConfig.AccountId>,
  walletAddress: ComputedRef<string | undefined>
) => {
  const { mainContractAddress } = useContracts(accountId.value);
  const isWalletConnected = computed(() => !!walletAddress.value);

  const { data: vestingAccountId, isLoading: isLoadingVestingAccountId } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId.value}.vesting-account` }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client
        .queryContractSmart(mainContractAddress.value, { get_item: { key: 'vesting_contract_address' } })
        .then(data => data?.item);
    },
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoadingVestingAccountId.value;
  });

  return { vestingAccountId, loading };
};
