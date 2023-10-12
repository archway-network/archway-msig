import { useQuery } from '@tanstack/vue-query';
import { useArch3, useContracts } from '@/composables';

import { AccountConfig } from '@/types';

export const useVestingAccountId = async (
  accountId: ComputedRef<AccountConfig.AccountId>,
  walletAddress: ComputedRef<string | undefined>
) => {
  const { mainContractAddress } = useContracts(accountId.value);
  const isWalletConnected = computed(() => !!walletAddress);

  const { data: vestingAccountId, isLoading: isLoadingVestingAccountId } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId.value}.vesting-account` }],
    queryFn: async () => {
      const { client } = await useArch3();
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
