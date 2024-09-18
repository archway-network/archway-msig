<script lang="ts" setup>
  import { DefaultModal } from '@/components/Ui';
  import ManageStakingProposal from '@/components/Staking/ManageStakingProposal.vue';
  import { useStakingValidators } from '@/data/useStakingValidators';

  defineProps({
    isOpen: { type: Boolean, default: false },
  });
  const emit = defineEmits(['close']);

  const { validators, loading } = await useStakingValidators();
</script>

<template>
  <DefaultModal class="!max-w-5xl" :is-open="isOpen" @close="emit('close')">
    <div class="flex-1 flex flex-col text-left px-12 py-12">
      <h2 class="title-5 pb-8">Manage Staking</h2>
      <ManageStakingProposal :validators="validators" @close="emit('close')" v-if="!loading && validators" />
    </div>
  </DefaultModal>
</template>
