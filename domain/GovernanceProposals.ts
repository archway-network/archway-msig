import { QueryFunctionContext } from '@tanstack/vue-query';
import { useConfig } from '@/composables';
import GovernanceProposal from './GovernanceProposal';
import GovernanceProposalVotes from './GovernanceProposalVotes';

import { GovernanceProposalId, GovernanceProposalsFilterType, GovernanceProposalsFilterTypes } from '@/types';

export default class GovernanceProposals {
  static async all({
    queryKey: [{ filter }],
  }: QueryFunctionContext<{ filter: GovernanceProposalsFilterType }[]>): Promise<GovernanceProposal[]> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/gov/v1beta1/proposals`, {
      query: {
        proposal_status: GovernanceProposals.proposalStatus(filter),
        'pagination.reverse': true,
      },
    }).then(data =>
      data?.proposals
        .filter((attributes: any) => {
          if (filter === GovernanceProposalsFilterTypes.ALL) {
            return attributes.status !== 'PROPOSAL_STATUS_DEPOSIT_PERIOD';
          }
          return true;
        })
        .map((attributes: any) => GovernanceProposal.make(attributes, tokenDenom))
    );
  }

  static async allIdsFor({ queryKey: [{ voter }] }: QueryFunctionContext<{ voter?: string }[]>): Promise<GovernanceProposalId[]> {
    const { restEndpoint } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/gov/v1beta1/proposals`, {
      query: {
        voter,
        'pagination.reverse': true,
      },
    }).then(data => {
      return data?.proposals.map((attributes: any) => attributes.proposal_id as GovernanceProposalId);
    });
  }

  static async votesTallyFor({
    queryKey: [{ proposalId }],
  }: QueryFunctionContext<{ proposalId: GovernanceProposalId }[]>): Promise<GovernanceProposalVotes> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`).then(data => {
      return GovernanceProposalVotes.make(data?.tally, tokenDenom);
    });
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
