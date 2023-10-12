<script lang="ts" setup>
  import { PropType } from 'vue';
  import ProposalDetailsModal from '@/components/Proposals/ProposalDetailsModal.vue';
  import { Proposal } from '@/domain';
  import { useModals } from '@/composables';

  defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });

  const { isOpen, openModal, closeModal } = useModals(false);
</script>

<template>
  <button class="text-left outline-none" @click="openModal">
    <slot></slot>
    <ProposalDetailsModal :is-open="isOpen" @close="closeModal" :proposal="proposal" v-if="isOpen" />
  </button>
</template>
