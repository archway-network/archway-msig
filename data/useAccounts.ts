import { type AccountConfig } from '@/types';

export const useAccounts = (): { accounts: AccountConfig.AccountId[] } => {
  const runtimeConfig = useRuntimeConfig();

  const accounts = runtimeConfig.public.app.contracts as AccountConfig.Account[];

  return { accounts: accounts.map((account: AccountConfig.Account) => account.mainAddress) };
};
