<script lang="tsx" setup>
  import TreasurySpendProposalAlert from './TreasurySpendProposalAlert.vue';
  import CreateTreasurySpendProposalForm from './CreateTreasurySpendProposalForm.vue';

  const emit = defineEmits(['close']);
</script>

<template>
  <div>
    <TreasurySpendProposalAlert class="mb-8" />
    <CreateTreasurySpendProposalForm @close="emit('close')" />
  </div>
</template>
