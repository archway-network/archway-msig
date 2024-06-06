<script lang="ts" setup>
  import { type PropType } from 'vue';
  import ProposalDetailsModal from '@/components/Governance/ProposalDetailsModal.vue';
  import { GovernanceProposal } from '@/domain';
  import { useModals } from '@/composables';

  defineProps({
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
  });

  const { isOpen, openModal, closeModal } = useModals(false);
</script>

<template>
  <button class="text-left outline-none" @click="openModal">
    <slot></slot>
    <ProposalDetailsModal :is-open="isOpen" @close="closeModal" :proposal="proposal" v-if="isOpen" />
  </button>
</template>
