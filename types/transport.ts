import { Coin } from '@cosmjs/amino';
import { GovParamsType } from '@cosmjs/stargate';
import { PaginatedRequest, PaginatedResponse } from './pagination';
import { Account, ModuleAccount } from '.';

export interface ITransport {
  getInflation: () => Promise<number>;

  getValidators: (query?: PaginatedRequest<{ status?: string }>) => Promise<PaginatedResponse<{ validators: any[] }>>;

  getValidatorsByDelegator: (delegatorAddress: string, query?: PaginatedRequest) => Promise<PaginatedResponse<{ validators: any[] }>>;

  getDelegationsByDelegator: (
    delegatorAddress: string,
    query?: PaginatedRequest
  ) => Promise<PaginatedResponse<{ delegation_responses: any[] }>>;

  getSupplyByDenom: (denom: string) => Promise<{ amount: Coin }>;

  getUnbondingDelegationsByDelegator: (
    delegatorAddress: string,
    query?: PaginatedRequest
  ) => Promise<PaginatedResponse<{ unbonding_responses: any[] }>>;

  getRewardsByDelegator: (delegatorAddress: string) => Promise<{ rewards: any[]; total: any[] }>;

  getGovernanceParams: <T extends GovParamsType>(
    paramType: T
  ) => Promise<{
    voting_params: typeof paramType extends 'voting' ? { voting_period: string } : undefined;
    tally_params: typeof paramType extends 'tallying' ? { quorum: string; threshold: string; veto_threshold: string } : undefined;
    deposit_params: typeof paramType extends 'deposit' ? { min_deposit: Coin[]; max_deposit_period: string } : undefined;
  }>;

  getAccount: (address: string) => Promise<{ account: Account | null }>;

  getModuleAccount: <T extends string = string>(moduleName: T) => Promise<{ account: ModuleAccount<T> | null }>;

  getModuleParams: (moduleName: string) => Promise<Record<string, unknown>>;

  getBalances: (address: string, query?: PaginatedRequest<{ resolve_denom?: boolean }>) => Promise<PaginatedResponse<{ balances: Coin[] }>>;

  getBalanceByDenom: (address: string, denom: string) => Promise<{ balance: Coin | null }>;

  getProposals: (
    query?: PaginatedRequest<{ proposal_status?: number; voter?: string; depositor?: string }>
  ) => Promise<PaginatedResponse<{ proposals: any[] }>>;

  getProposalById: (proposalId: string) => Promise<{ proposal: any }>;

  getProposalDeposits: (proposalId: string, query?: PaginatedRequest) => Promise<PaginatedResponse<{ deposits: any[] }>>;

  getProposalTally: (
    proposalId: string
  ) => Promise<{ tally: { yes_count: string; abstain_count: string; no_count: string; no_with_veto_count: string } }>;

  getProposalVotes: (proposalId: string, query?: PaginatedRequest) => Promise<PaginatedResponse<{ votes: any[] }>>;
}
