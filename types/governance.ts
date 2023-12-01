export const GovernanceProposalsFilterTypes = {
  ALL: 'PROPOSAL_STATUS_UNSPECIFIED',
  DEPOSIT_PERIOD: 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  IN_PROGRESS: 'PROPOSAL_STATUS_VOTING_PERIOD',
  PASSED: 'PROPOSAL_STATUS_PASSED',
  REJECTED: 'PROPOSAL_STATUS_REJECTED',
  FAILED: 'PROPOSAL_STATUS_FAILED',
} as const;

export type GovernanceProposalsFilterType = (typeof GovernanceProposalsFilterTypes)[keyof typeof GovernanceProposalsFilterTypes];

export type GovernanceProposalId = string | number;

export enum GovernanceProposalStatus {
  IN_PROGRESS,
  DEPOSIT_PERIOD,
  PASSED,
  REJECTED,
  FAILED,
}
export enum GovernanceProposalType {
  TEXT = 'Text',
  COMMUNITY_POOL_SPEND = 'Community Pool Spend',
  PARAMETER_CHANGE = 'Parameter Change',
  SOFTWARE_UPGRADE = 'Software Upgrade',
  CANCEL_SOFTWARE_UPGRADE = 'Cancel Software Upgrade',
}

export type GovernanceProposalVoteOption = 'yes' | 'no' | 'abstain' | 'no_with_veto';
