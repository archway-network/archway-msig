import { AccountConfig } from '@/types';

export const useAccountId = () => {
  const route = useRoute();

  return { accountId: computed(() => route.params.accountId as AccountConfig.AccountId) };
};
