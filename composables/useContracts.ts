import { computed } from 'vue';

import { type AccountConfig } from '@/types';

export const useContracts = (accountId: AccountConfig.AccountId) => {
  const runtimeConfig = useRuntimeConfig();
  const accounts = runtimeConfig.public.app.contracts as AccountConfig.Account[];

  const account = accounts.find((account: AccountConfig.Account) => account.mainAddress === accountId);

  const mainContractAddress = computed(() => account?.mainAddress || '');
  const preProposeContractAddress = computed(() => account?.preProposeAddress || '');
  const proposalsContractAddress = computed(() => account?.proposalsAddress || '');
  const membersContractAddress = computed(() => account?.membersAddress || '');
  const votingContractAddress = computed(() => account?.membersAddress || '');

  const vestingDeployerContract = computed(() => runtimeConfig.public.app.vesting.deployerContract);
  const vestingCodeId = computed(() => Number(runtimeConfig.public.app.vesting.codeId) || undefined);

  return {
    mainContractAddress,
    preProposeContractAddress,
    proposalsContractAddress,
    membersContractAddress,
    votingContractAddress,
    vestingDeployerContract,
    vestingCodeId,
  };
};
