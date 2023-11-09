import { useConfig } from '@/composables';
import type { ITransport } from '@/types';

export const restTransport: ITransport = {
  getInflation: async () => {
    const { restEndpoint } = useConfig();
    const res = await $fetch<{ inflation: string }>(`${restEndpoint}/cosmos/mint/v1beta1/inflation`)
    return Number(res?.inflation ?? 0)
  },

  getSupplyByDenom: async (denom) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/bank/v1beta1/supply/by_denom`,
      { query: { denom } },
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
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}/by_denom`,
      { query: { denom } },
    )
  },

  getProposals: async (query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1/proposals`,
      { query },
    )
  },

  getProposalById: async (proposalId) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1/proposals/${proposalId}`,
    )
  },

  getProposalDeposits: async (proposalId, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1/proposals/${proposalId}/deposits`,
      { query },
    )
  },

  getProposalTally: async (proposalId) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1/proposals/${proposalId}/tally`,
    )
  },

  getProposalVotes: async (proposalId, query) => {
    const { restEndpoint } = useConfig();
    return await $fetch(
      `${restEndpoint}/cosmos/gov/v1/proposals/${proposalId}/votes`,
      { query },
    )
  },
}
