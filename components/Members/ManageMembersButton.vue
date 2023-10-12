<script lang="ts" setup>
  import { CogIcon } from '@heroicons/vue/24/solid';
  import { PrimaryButton } from '@/components/Ui';
  import ManageMembersModal from './ManageMembersModal.vue';
  import { useModals } from '@/composables';

  const { isOpen, openModal, closeModal } = useModals(false);
</script>

<template>
  <PrimaryButton class="flex items-center space-x-2" @click="openModal">
    <CogIcon class="w-5 h-5" />
    <span>Manage members</span>
    <ManageMembersModal :is-open="isOpen" @close="closeModal" v-if="isOpen" />
  </PrimaryButton>
</template>
