import { useQuery } from '@tanstack/vue-query';
import { useArchwayClient, useConfig } from '@/composables';

import { VestingAccount } from '@/domain';

import { AccountConfig } from '@/types';

export const useVestingAccount = async (
  accountId: ComputedRef<AccountConfig.AccountId>,
  vestingAccountId: string,
  walletAddress: ComputedRef<string | undefined>
) => {
  const isWalletConnected = computed(() => !!walletAddress.value);
  const { tokenDenom } = useConfig();

  const { data: account, isLoading } = useQuery({
    queryKey: [{ scope: 'vesting-accounts', entity: `account.${accountId.value}.status` }],
    queryFn: async () => {
      const client = useArchwayClient();
      return client
        .queryContractSmart(vestingAccountId, { status: {} })
        .then(data => VestingAccount.make(accountId.value, vestingAccountId, data, tokenDenom));
    },
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoading.value;
  });

  return { account, loading };
};
