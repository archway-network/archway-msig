import { useArchwayClient } from '@/composables';
import type { ITransport } from '@/types';

// FIXME: Update methods once new version of the arch3.js is out
export const rpcTransport: ITransport = {
  getInflation: async () => {
    throw new Error('Not Implemented!');
  },

  getSupplyByDenom: async () => {
    throw new Error('Not Implemented!');
  },

  getValidators: async () => {
    throw new Error('Not Implemented!');
  },

  getValidatorsByDelegator: async () => {
    throw new Error('Not Implemented!');
  },

  getUnbondingDelegationsByDelegator: async () => {
    throw new Error('Not Implemented!');
  },

  getRewardsByDelegator: async () => {
    throw new Error('Not Implemented!');
  },

  getDelegationsByDelegator: async () => {
    throw new Error('Not Implemented!');
  },

  getGovernanceParams: async () => {
    throw new Error('Not Implemented!');
  },

  getAccount: async address => {
    const client = useArchwayClient();
    const account = await client.getAccount(address);
    return { account };
  },

  getModuleAccount: async () => {
    throw new Error('Not Implemented!');
  },

  getModuleParams: async () => {
    throw new Error('Not Implemented!');
  },

  getBalances: async () => {
    throw new Error('Not Implemented!');
  },

  getBalanceByDenom: async (address, denom) => {
    const client = useArchwayClient();
    const balance = await client.getBalance(address, denom);
    return { balance };
  },

  getProposals: async () => {
    throw new Error('Not Implemented!');
  },

  getProposalById: async () => {
    throw new Error('Not Implemented!');
  },

  getProposalDeposits: async () => {
    throw new Error('Not Implemented!');
  },

  getProposalTally: async () => {
    throw new Error('Not Implemented!');
  },

  getProposalVotes: async () => {
    throw new Error('Not Implemented!');
  },
};
