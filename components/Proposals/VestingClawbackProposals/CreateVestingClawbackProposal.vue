<script lang="tsx" setup>
  import { ref } from 'vue';
  import VestingClawbackProposalAlert from './VestingClawbackProposalAlert.vue';
  import VestingClawbackDisabledAlert from './VestingClawbackDisabledAlert.vue';
  import VestingContractSelector from './VestingContractSelector.vue';
  import CreateVestingClawbackProposalForm from './CreateVestingClawbackProposalForm.vue';
  import { VestingAccount } from '@/domain';

  const emit = defineEmits(['close']);

  const vestingAccount = ref<VestingAccount>();
</script>

<template>
  <div>
    <VestingClawbackProposalAlert class="mb-8" />
    <VestingContractSelector @select="account => (vestingAccount = account)" />
    <div class="pt-6" v-if="vestingAccount">
      <VestingClawbackDisabledAlert v-if="!vestingAccount.canClawback" />
      <CreateVestingClawbackProposalForm :vesting-account="vestingAccount" @close="emit('close')" v-else />
    </div>
  </div>
</template>
