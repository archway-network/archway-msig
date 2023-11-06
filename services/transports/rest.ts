import { useConfig } from '@/composables';
import type { ITransport } from '@/types';
import { Coin } from '@cosmjs/amino';

export const restTransport: ITransport = {
  getInflation: async () => {
    const { restEndpoint } = useConfig();
    const res = await $fetch<{ inflation: string }>(`${restEndpoint}/cosmos/mint/v1beta1/inflation`)
    return Number(res?.inflation ?? 0)
  },

  getSupplyByDenom: async (denom) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/bank/v1beta1/supply/${denom}`,
    )
  },

  getValidators: async (query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/staking/v1beta1/validators`,
      { query },
    )
  },

  getValidatorsByDelegator: async (delegatorAddress, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`,
      { query },
    )
  },

  getUnbondingDelegationsByDelegator: async (delegatorAddress, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/unbonding_delegations`,
      { query },
    )
  },

  getRewardsByDelegator: async (delegatorAddress) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`,
    )
  },

  getDelegationsByDelegator: async (delegatorAddress, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`,
      { query },
    )
  },

  getGovernanceParams: async (paramType) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/params/${paramType}`,
    )
  },

  getAccount: async (address) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/auth/v1beta1/accounts/${address}`,
    )
  },

  getBalances: async (address, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}`,
      { query },
    )
  },

  getBalanceByDenom: async (address, denom) => {
    // NOTE: Search among all the balances since the
    // `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}/${denom}` route doesn't work as expected
    const { restEndpoint } = useConfig();
    const { balances } = await $fetch<{ balances: Coin[] }>(
      `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}`,
    )
    return { balance: balances.find(x => x.denom === denom) ?? null }
  },

  getProposals: async (query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/proposals`,
      { query },
    )
  },

  getProposalById: async (proposalId) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}`,
    )
  },

  getProposalDeposits: async (proposalId, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}/deposits`,
      { query },
    )
  },

  getProposalTally: async (proposalId) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`,
    )
  },

  getProposalVotes: async (proposalId, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}/votes`,
      { query },
    )
  },
}
