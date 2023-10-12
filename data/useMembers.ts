import { useQuery } from '@tanstack/vue-query';
import { useArch3, useContracts } from '@/composables';

import { Member } from '@/domain';
import { AccountConfig } from '@/types';

export const useMembers = async (accountId: AccountConfig.AccountId, walletAddress: ComputedRef<string | undefined>) => {
  const { membersContractAddress } = useContracts(accountId);
  const isWalletConnected = computed(() => !!walletAddress);

  const { data: members, isLoading } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `account.${accountId}.members`, address: walletAddress }],
    queryFn: async () => {
      const { client } = await useArch3();
      return client
        .queryContractSmart(membersContractAddress.value, { list_members: {} })
        .then(({ members }) => (members || []).map((attributes: any) => Member.make(attributes)));
    },
    enabled: isWalletConnected,
  });

  const loading = computed(() => {
    if (!isWalletConnected.value) return false;

    return isLoading.value;
  });

  return { members, loading };
};
