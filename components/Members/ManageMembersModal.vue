<script lang="ts" setup>
  import { DefaultModal } from '@/components/Ui';
  import ManageMembersProposal from '@/components/Members/ManageMembersProposal.vue';

  defineProps({
    isOpen: { type: Boolean, default: false },
  });
  const emit = defineEmits(['close']);
</script>

<template>
  <DefaultModal class="!max-w-5xl" :is-open="isOpen" @close="emit('close')">
    <div class="flex-1 flex flex-col text-left px-12 py-12">
      <h2 class="title-5 pb-8">Manage Members</h2>
      <ManageMembersProposal @close="emit('close')" />
    </div>
  </DefaultModal>
</template>
