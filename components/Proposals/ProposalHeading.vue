<script lang="ts" setup>
  import { PropType } from 'vue';
  import ProposalStatusLabel from '@/components/Proposals/ProposalStatusLabel.vue';

  import { ProposalStatus } from '@/types';

  defineProps({
    id: { type: [String, Number], required: true },
    status: { type: Number as PropType<ProposalStatus>, required: true },
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
