import { QueryFunctionContext } from '@tanstack/vue-query';

import { useArch3, useContracts } from '@/composables';
import Proposal from './Proposal';
import ProposalVote from './ProposalVote';

import { AccountConfig, ProposalId } from '@/types';

export default class Proposals {
  static async all({ queryKey: [{ accountId }] }: QueryFunctionContext<{ accountId: AccountConfig.AccountId }[]>): Promise<Proposal[]> {
    const { proposalsContractAddress } = useContracts(accountId);
    const { client } = await useArch3();
    return client.queryContractSmart(proposalsContractAddress.value, { reverse_proposals: { limit: 10000 } }).then(data => {
      return (data?.proposals || []).map(({ id, proposal }: any) => Proposal.make(id, proposal));
    });
  }

  static async votesFor({
    queryKey: [{ accountId, proposalId }],
  }: QueryFunctionContext<{ accountId: AccountConfig.AccountId; proposalId: ProposalId }[]>): Promise<ProposalVote[]> {
    const { proposalsContractAddress } = useContracts(accountId);
    const { client } = await useArch3();
    return client.queryContractSmart(proposalsContractAddress.value, { list_votes: { proposal_id: proposalId } }).then(data => {
      return (data?.votes || []).map((attributes: any) => ProposalVote.make(attributes));
    });
  }
}
