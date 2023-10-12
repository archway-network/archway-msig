<script lang="tsx" setup>
  import GovernanceProposalAlert from './GovernanceProposalAlert.vue';
  import CreateGovernanceProposalForm from './CreateGovernanceProposalForm.vue';

  import { GovernanceProposalType } from '@/types';

  defineProps<{ proposalType: GovernanceProposalType }>();
  const emit = defineEmits(['close']);
</script>

<template>
  <div class="space-y-8">
    <GovernanceProposalAlert :governance-proposal-type="proposalType" />
    <CreateGovernanceProposalForm :type="proposalType" @close="emit('close')" />
  </div>
</template>
