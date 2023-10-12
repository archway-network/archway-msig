import { formatDistanceToNow } from 'date-fns';
import { parseEncodedMessage } from '@/utils';

import { ProposalStatus, ProposalMessageType } from '@/types';

type ProposalFormattedAttributes = {
  votingDeadline: string;
};

export default class Proposal {
  public totalVotes: number;
  public formatted: ProposalFormattedAttributes;

  constructor(
    public id: string,
    public proposer: string,
    public totalPower: number,
    public title: string,
    public status: ProposalStatus,
    public allowRevoting: Boolean,
    public votingDeadline: Date,
    public messageTypes: ProposalMessageType[],
    public votes: { yes: number; no: number; abstain: number },
    public description?: string,
    public msgs?: any
  ) {
    this.totalVotes = this.votes.yes + this.votes.no + this.votes.abstain;
    this.formatted = this.formatAttributes();
  }

  static make(id: string, attributes: any) {
    const { proposer, title, description, status, expiration, total_power, allow_revoting, votes, msgs } = attributes;

    return new Proposal(
      id,
      proposer,
      total_power,
      title,
      Proposal.status(status),
      !!allow_revoting,
      new Date(Number(expiration.at_time) / 1e6), // Timestamp is in nanoseconds, convert to microseconds.
      Proposal.determineMessageType(attributes.msgs),
      { yes: votes.yes | 0, no: votes.no | 0, abstain: votes.abstain | 0 },
      description,
      msgs
    );
  }

  isInProgress(): boolean {
    return this.status === ProposalStatus.IN_PROGRESS;
  }

  isPasssed(): boolean {
    return this.status === ProposalStatus.PASSED;
  }

  canBeClosed(): boolean {
    return [ProposalStatus.REJECTED, ProposalStatus.FAILED].includes(this.status);
  }

  isForMembers(): boolean {
    return this.messageTypes.includes(ProposalMessageType.MEMBERS);
  }

  isForStaking(): boolean {
    return this.messageTypes.includes(ProposalMessageType.STAKING);
  }

  isForRewards(): boolean {
    return this.messageTypes.includes(ProposalMessageType.REWARDS);
  }

  isForGovernance(): boolean {
    return this.messageTypes.includes(ProposalMessageType.GOVERNANCE);
  }

  isForVestingClawbacks(): boolean {
    return this.messageTypes.includes(ProposalMessageType.VESTING_CLAWBACK);
  }

  isForVestingClaimRewards(): boolean {
    return this.messageTypes.includes(ProposalMessageType.VESTING_CLAIM_REWARDS);
  }

  isForVestingWithdrawRewards(): boolean {
    return this.messageTypes.includes(ProposalMessageType.VESTING_WITHDRAW_REWARDS);
  }

  isForVestingWithdrawTokens(): boolean {
    return this.messageTypes.includes(ProposalMessageType.VESTING_WITHDRAW_TOKENS);
  }

  isForVotingConfiguration(): boolean {
    return this.messageTypes.includes(ProposalMessageType.VOTING_CONFIGURATION);
  }

  formatAttributes(): ProposalFormattedAttributes {
    return {
      votingDeadline: formatDistanceToNow(this.votingDeadline, { addSuffix: true }),
    };
  }

  static status(status: 'open' | 'rejected' | 'passed' | 'executed' | 'closed' | 'execution_failed'): ProposalStatus {
    return {
      open: ProposalStatus.IN_PROGRESS,
      passed: ProposalStatus.PASSED,
      rejected: ProposalStatus.REJECTED,
      executed: ProposalStatus.EXECUTED,
      execution_failed: ProposalStatus.FAILED,
      closed: ProposalStatus.CLOSED,
    }[status];
  }

  static determineMessageType(attributes: any): ProposalMessageType[] {
    const messageTypes = [
      ...(attributes || []).map((message: any) => {
        const msgType = Object.keys(message)[0];

        if (msgType !== 'wasm') return msgType;

        const encodedMessage = parseEncodedMessage(message?.wasm?.execute.msg, true);

        if (encodedMessage.includes('update_config')) return 'voting-configuration';
        if (encodedMessage.includes('update_members')) return 'members';
        if (encodedMessage.includes('clawback')) return 'vesting-clawback';
        if (encodedMessage.includes('collect_staking_rewards')) return 'vesting-claim-rewards';
        if (encodedMessage.includes('withdraw_staking_rewards')) return 'vesting-withdraw-rewards';
        if (encodedMessage.includes('withdraw_vested_coins')) return 'vesting-withdraw-tokens';

        return msgType;
      }),
    ];

    return [...new Set(messageTypes)].map(
      (
        type:
          | 'staking'
          | 'members'
          | 'distribution'
          | 'gov'
          | 'voting-configuration'
          | 'vesting-clawback'
          | 'vesting-claim-rewards'
          | 'vesting-withdraw-rewards'
          | 'vesting-withdraw-tokens'
      ) =>
        ({
          staking: ProposalMessageType.STAKING,
          members: ProposalMessageType.MEMBERS,
          distribution: ProposalMessageType.REWARDS,
          gov: ProposalMessageType.GOVERNANCE,
          'vesting-clawback': ProposalMessageType.VESTING_CLAWBACK,
          'vesting-claim-rewards': ProposalMessageType.VESTING_CLAIM_REWARDS,
          'vesting-withdraw-rewards': ProposalMessageType.VESTING_WITHDRAW_REWARDS,
          'vesting-withdraw-tokens': ProposalMessageType.VESTING_WITHDRAW_TOKENS,
          'voting-configuration': ProposalMessageType.VOTING_CONFIGURATION,
        }[type])
    );
  }
}
