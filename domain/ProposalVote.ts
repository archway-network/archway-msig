import { type ProposalVoteOption } from '@/types';

export default class ProposalVote {
  constructor(public voter: string, public vote: ProposalVoteOption, public power: number, public rationale?: string) {}

  static make(attributes: any) {
    const { voter, vote, power, rationale } = attributes;

    return new ProposalVote(voter, vote, power | 0, rationale);
  }
}
