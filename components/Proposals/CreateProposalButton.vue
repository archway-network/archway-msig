<script lang="ts" setup>
  import { PlusIcon } from '@heroicons/vue/24/solid';
  import { PrimaryButton } from '@/components/Ui';
  import CreateProposalModal from '@/components/Proposals/CreateProposalModal.vue';
  import { useModals } from '@/composables';

  const { isOpen, openModal, closeModal } = useModals(false);
</script>

<template>
  <PrimaryButton class="flex items-center space-x-3" @click="openModal">
    <PlusIcon class="w-4 h-4" />
    <span>Create Proposal</span>
    <CreateProposalModal :is-open="isOpen" @close="closeModal" v-if="isOpen" />
  </PrimaryButton>
</template>
