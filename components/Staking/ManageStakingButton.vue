<script lang="ts" setup>
  import { CogIcon } from '@heroicons/vue/24/solid';
  import { PrimaryButton } from '@/components/Ui';
  import ManageStakingModal from '@/components/Staking/ManageStakingModal.vue';
  import { useModals } from '@/composables';

  const { isOpen, openModal, closeModal } = useModals(false);
</script>

<template>
  <PrimaryButton class="flex items-center space-x-2" @click="openModal">
    <CogIcon class="w-5 h-5" />
    <span>Manage Staking</span>
    <ManageStakingModal :is-open="isOpen" @close="closeModal" v-if="isOpen" />
  </PrimaryButton>
</template>
