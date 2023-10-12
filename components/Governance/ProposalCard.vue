<script lang="ts" setup>
  import { PropType } from 'vue';
  import ProposalHeading from '@/components/Governance/ProposalHeading.vue';
  import { GovernanceProposal } from '@/domain';

  defineProps({
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
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
        <dt class="label text-gray-800">{{ proposal.isInDepositPeriod() ? 'Submitted on' : 'Voting Started' }}</dt>
        <dd class="caption">
          {{ proposal.isInDepositPeriod() ? proposal.formatted.submittedOn : proposal.formatted.votingStart }}
        </dd>
      </dl>
      <dl class="space-y-2">
        <dt class="label text-gray-800">{{ proposal.isInDepositPeriod() ? 'Deposit Deadline' : 'Voting Deadline' }}</dt>
        <dd class="caption">
          {{ proposal.isInDepositPeriod() ? proposal.formatted.depositDeadline : proposal.formatted.votingDeadline }}
        </dd>
      </dl>
    </div>
  </div>
</template>
