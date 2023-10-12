<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Tokens } from '@/components/Ui';
  import ProposalVotingSkeleton from '@/components/Governance/ProposalVotingSkeleton.vue';
  import ProposalVotingProgress from '@/components/Governance/ProposalVotingProgress.vue';
  import { useGovernanceProposalVotes } from '@/data/useGovernanceProposalVotes';
  import { GovernanceProposal } from '@/domain';

  const props = defineProps({
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
  });

  const { proposalVotes, loading } = await useGovernanceProposalVotes(props.proposal.id, props.proposal.isInProgress());
</script>

<template>
  <ProposalVotingSkeleton v-if="loading || !proposalVotes" />
  <div v-else>
    <ProposalVotingProgress :votes="proposalVotes" class="pb-8" />
    <Tokens class="pb-6" before>{{ proposalVotes.formatted.total }}</Tokens>
    <div class="flex justify-between">
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-green-700" />
          <span class="label">Yes</span>
        </dt>
        <dd class="caption">{{ proposalVotes.formatted.percentages.yes }}%</dd>
      </dl>
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-orange" />
          <span class="label">No</span>
        </dt>
        <dd class="caption">{{ proposalVotes.formatted.percentages.noWithoutVeto }}%</dd>
      </dl>
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-red" />
          <span class="label">No w/ Veto</span>
        </dt>
        <dd class="caption">{{ proposalVotes.formatted.percentages.noWithVeto }}%</dd>
      </dl>
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-gray" />
          <span class="label">Abstain</span>
        </dt>
        <dd class="caption">{{ proposalVotes.formatted.percentages.abstain }}%</dd>
      </dl>
    </div>
  </div>
</template>
