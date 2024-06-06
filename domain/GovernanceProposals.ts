import { type QueryFunctionContext } from '@tanstack/vue-query';
import { useConfig } from '@/composables';
import GovernanceProposal from './GovernanceProposal';
import GovernanceProposalVotes from './GovernanceProposalVotes';

import { type GovernanceProposalId, type GovernanceProposalsFilterType, GovernanceProposalsFilterTypes } from '@/types';

export default class GovernanceProposals {
  static async all({
    queryKey: [{ filter }],
  }: QueryFunctionContext<{ filter: GovernanceProposalsFilterType }[]>): Promise<GovernanceProposal[]> {
    const { tokenDenom, transport } = useConfig();

    const data = await transport.getProposals({
      proposal_status: GovernanceProposals.proposalStatus(filter),
      'pagination.reverse': true,
    });

    return data?.proposals
      .filter(attributes => {
        if (filter === GovernanceProposalsFilterTypes.ALL) {
          return attributes.status !== 'PROPOSAL_STATUS_DEPOSIT_PERIOD';
        }
        return true;
      })
      .map(attributes => GovernanceProposal.make(attributes, tokenDenom));
  }

  static async allIdsFor({ queryKey: [{ voter }] }: QueryFunctionContext<{ voter?: string }[]>): Promise<GovernanceProposalId[]> {
    const { transport } = useConfig();
    const data = await transport.getProposals({
      voter,
      'pagination.reverse': true,
    });
    return data?.proposals.map((attributes: any) => attributes.proposal_id as GovernanceProposalId);
  }

  static async votesTallyFor({
    queryKey: [{ proposalId }],
  }: QueryFunctionContext<{ proposalId: GovernanceProposalId }[]>): Promise<GovernanceProposalVotes> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getProposalTally(`${proposalId}`);
    return GovernanceProposalVotes.make(data?.tally, tokenDenom);
  }

  static proposalStatus(filter: GovernanceProposalsFilterType) {
    return {
      [GovernanceProposalsFilterTypes.ALL]: undefined,
      [GovernanceProposalsFilterTypes.DEPOSIT_PERIOD]: 1,
      [GovernanceProposalsFilterTypes.IN_PROGRESS]: 2,
      [GovernanceProposalsFilterTypes.PASSED]: 3,
      [GovernanceProposalsFilterTypes.REJECTED]: 4,
      [GovernanceProposalsFilterTypes.FAILED]: 5,
    }[filter];
  }
}
