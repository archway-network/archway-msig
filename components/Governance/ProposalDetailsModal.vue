<script lang="ts" setup>
  import { PropType } from 'vue';
  import { DefaultModal } from '@/components/Ui';
  import ProposalDetails from '@/components/Governance/ProposalDetails.vue';
  import { GovernanceProposal } from '@/domain';

  defineProps({
    isOpen: { type: Boolean, default: false },
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
  });

  const emit = defineEmits(['close']);
</script>

<template>
  <DefaultModal class="!max-w-7xl !min-h-[75vh]" :is-open="isOpen" @close="emit('close')">
    <ProposalDetails :proposal="proposal" @close="emit('close')" />
  </DefaultModal>
</template>
