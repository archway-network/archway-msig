<script lang="ts" setup>
  import { PropType } from 'vue';
  import ProposalVotingProgress from '@/components/Proposals/ProposalVotingProgress.vue';
  import { Proposal } from '@/domain';

  defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });
</script>

<template>
  <div>
    <ProposalVotingProgress :votes="proposal.votes" class="pb-8" />
    <div class="flex justify-between">
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-green-700" />
          <span class="label">Yes</span>
        </dt>
        <dd class="caption">{{ (proposal.votes.yes / proposal.totalPower) * 100 }}%</dd>
      </dl>
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-orange" />
          <span class="label">No</span>
        </dt>
        <dd class="caption">{{ (proposal.votes.no / proposal.totalPower) * 100 }}%</dd>
      </dl>
      <dl class="space-y-2">
        <dt class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-gray" />
          <span class="label">Abstain</span>
        </dt>
        <dd class="caption">{{ (proposal.votes.abstain / proposal.totalPower) * 100 }}%</dd>
      </dl>
    </div>
  </div>
</template>
