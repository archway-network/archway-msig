import TokenAmount from '@/domain/TokenAmount';

export enum CustomProposalTypes {
  TreasurySpend = 'Treasury Spend',
  VotingConfig = 'Voting Configuration',
  CreateVestingContract = 'Create Vesting Contract',
  VestingClawback = 'Vesting Clawback',
  ExecuteContract = 'Execute Contract',
  Governance = 'Governance',
  Custom = 'Custom',
}

export const ProposalsFilterTypes = {
  ALL: 'ALL',
  IN_PROGRESS: 'IN_PROGRESS',
  TO_EXECUTE: 'PROPOSAL_STATUS_TO_EXECUTE',
  EXECUTED: 'PROPOSAL_STATUS_EXECUTED',
  FAILED: 'PROPOSAL_STATUS_FAILED',
} as const;

export type ProposalsFilterType = (typeof ProposalsFilterTypes)[keyof typeof ProposalsFilterTypes];

export type ProposalId = string | number;

export enum ProposalMessageType {
  MEMBERS = 'members',
  STAKING = 'staking',
  REWARDS = 'rewards',
  GOVERNANCE = 'governance',
  VESTING_CLAWBACK = 'vesting-clawback',
  VESTING_CLAIM_REWARDS = 'vesting-claim-rewards',
  VESTING_WITHDRAW_REWARDS = 'vesting-withdraw-rewards',
  VESTING_WITHDRAW_TOKENS = 'vesting-withdraw-tokens',
  VOTING_CONFIGURATION = 'voting-configuration',
  CONTRACT_INSTANTIATE = 'contract-instantiate',
}

export enum ProposalStatus {
  IN_PROGRESS,
  PASSED,
  REJECTED,
  EXECUTED,
  FAILED,
  CLOSED,
}

export type ProposalVoteOption = 'yes' | 'no' | 'abstain';

export type TreasurySpendBlock = {
  amount: TokenAmount;
  address: string;
};
