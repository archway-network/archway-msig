<script lang="ts" setup>
  import { PropType } from 'vue';
  import ProposalHeading from '@/components/Proposals/ProposalHeading.vue';
  import { Proposal } from '@/domain';

  defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });
</script>

<template>
  <div class="bg-white rounded-2xl px-8 py-8 flex flex-col h-full">
    <ProposalHeading class="flex justify-between items-center pb-8" :id="proposal.id" :status="proposal.status" />
    <div class="pb-8 flex-1">
      <p class="text-gray-800 line-clamp-3">{{ proposal.title }}</p>
    </div>
    <div class="flex justify-between">
      <dl class="space-y-2">
        <dt class="label text-gray-800">Voting deadline</dt>
        <dd class="caption">
          {{ proposal.formatted.votingDeadline }}
        </dd>
      </dl>
      <dl class="space-y-2">
        <dt class="label text-gray-800">Votes</dt>
        <dd class="caption">{{ proposal.totalVotes }} / {{ proposal.totalPower }}</dd>
      </dl>
    </div>
  </div>
</template>
