import { parseISO } from 'date-fns';

import GovernanceProposalVotes from './GovernanceProposalVotes';
import TokenAmount from './TokenAmount';
import { formatDate, formatFullDateTime } from '@/utils';

import { GovernanceProposalStatus, TokenDenom } from '@/types';

type CosmosProposalStatus =
  | 'PROPOSAL_STATUS_UNSPECIFIED'
  | 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
  | 'PROPOSAL_STATUS_VOTING_PERIOD'
  | 'PROPOSAL_STATUS_PASSED'
  | 'PROPOSAL_STATUS_REJECTED'
  | 'PROPOSAL_STATUS_FAILED';

type GovernanceProposalFormattedAttributes = {
  createdAt: string;
  submittedOn: string;
  votingStart: string;
  depositDeadline: string;
  votingDeadline: string;
};

export default class GovernanceProposal {
  public formatted: GovernanceProposalFormattedAttributes;

  constructor(
    public id: string | number,
    public title: string,
    public description: string,
    public status: GovernanceProposalStatus,
    public submittedOn: Date,
    public depositDeadline: Date,
    public votingStart: Date,
    public votingDeadline: Date,
    public totalDeposit: TokenAmount,
    public votes: GovernanceProposalVotes
  ) {
    this.formatted = this.formatAttributes();
  }

  static make(attributes: any, tokenDenom: TokenDenom) {
    const {
      proposal_id,
      content,
      status,
      submit_time,
      deposit_end_time,
      voting_start_time,
      voting_end_time,
      total_deposit,
      final_tally_result,
    } = attributes;

    return new GovernanceProposal(
      proposal_id,
      content?.title,
      content?.description,
      GovernanceProposal.status(status),
      parseISO(submit_time),
      parseISO(deposit_end_time),
      parseISO(voting_start_time),
      parseISO(voting_end_time),
      TokenAmount.makeFromAmount(total_deposit?.[0]?.amount || 0, tokenDenom),
      GovernanceProposalVotes.make(final_tally_result, tokenDenom)
    );
  }

  isInDepositPeriod(): boolean {
    return this.status === GovernanceProposalStatus.DEPOSIT_PERIOD;
  }

  isInProgress(): boolean {
    return this.status === GovernanceProposalStatus.IN_PROGRESS;
  }

  formatAttributes(): GovernanceProposalFormattedAttributes {
    return {
      createdAt: formatFullDateTime(this.submittedOn),
      submittedOn: formatDate(this.submittedOn),
      votingStart: formatDate(this.votingStart),
      depositDeadline: formatDate(this.depositDeadline),
      votingDeadline: formatDate(this.votingDeadline),
    };
  }

  static status(status: CosmosProposalStatus): GovernanceProposalStatus {
    return {
      PROPOSAL_STATUS_DEPOSIT_PERIOD: GovernanceProposalStatus.DEPOSIT_PERIOD,
      PROPOSAL_STATUS_VOTING_PERIOD: GovernanceProposalStatus.IN_PROGRESS,
      PROPOSAL_STATUS_PASSED: GovernanceProposalStatus.PASSED,
      PROPOSAL_STATUS_REJECTED: GovernanceProposalStatus.REJECTED,
      PROPOSAL_STATUS_FAILED: GovernanceProposalStatus.FAILED,
      PROPOSAL_STATUS_UNSPECIFIED: GovernanceProposalStatus.FAILED,
    }[status];
  }
}
