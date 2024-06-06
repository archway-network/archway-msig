<script lang="ts" setup>
  import { type PropType } from 'vue';
  import InProgressLabel from '@/components/Proposals/Labels/InProgressLabel.vue';
  import PassedLabel from '@/components/Proposals/Labels/PassedLabel.vue';
  import ExecutedLabel from '@/components/Proposals/Labels/ExecutedLabel.vue';
  import ClosedLabel from '@/components/Proposals/Labels/ClosedLabel.vue';
  import FailedLabel from '@/components/Proposals/Labels/FailedLabel.vue';
  import RejectedLabel from '@/components/Proposals/Labels/RejectedLabel.vue';

  import { ProposalStatus } from '@/types';

  defineProps({
    status: { type: Number as PropType<ProposalStatus>, required: true },
  });
</script>

<template>
  <InProgressLabel v-if="status === ProposalStatus.IN_PROGRESS" />
  <PassedLabel v-if="status === ProposalStatus.PASSED" />
  <ExecutedLabel v-if="status === ProposalStatus.EXECUTED" />
  <FailedLabel v-if="status === ProposalStatus.FAILED" />
  <ClosedLabel v-if="status === ProposalStatus.CLOSED" />
  <RejectedLabel v-if="status === ProposalStatus.REJECTED" />
</template>
