<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';
  import VotingConfigProposalAlert from './VotingConfigProposalAlert.vue';
  import CreateVotingConfigProposalSkeleton from './CreateVotingConfigProposalSkeleton.vue';
  import CreateVotingConfigProposalForm from './CreateVotingConfigProposalForm.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useAccountVotingConfiguration } from '@/data/useAccountVotingConfiguration';
  import { useAuthStore } from '@/store';

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { votingConfiguration, loading: loadingVotingConfiguration } = await useAccountVotingConfiguration(accountId.value, walletAddress);
</script>

<template>
  <div>
    <VotingConfigProposalAlert class="mb-8" />
    <CreateVotingConfigProposalSkeleton v-if="loadingVotingConfiguration" />
    <CreateVotingConfigProposalForm
      :account-voting-configuration="votingConfiguration"
      @close="emit('close')"
      v-else-if="votingConfiguration"
    />
  </div>
</template>
