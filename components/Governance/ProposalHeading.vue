<script lang="ts" setup>
  import { type PropType } from 'vue';
  import ProposalStatusLabel from '@/components/Governance/ProposalStatusLabel.vue';

  import { GovernanceProposalStatus } from '@/types';

  defineProps({
    id: { type: [String, Number], required: true },
    status: { type: Number as PropType<GovernanceProposalStatus>, required: true },
  });
</script>

<template>
  <div>
    <div class="text-gray">#{{ id }}</div>
    <div>
      <ProposalStatusLabel :status="status" />
    </div>
  </div>
</template>
