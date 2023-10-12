<script lang="ts" setup>
  import { BackButton, DefaultModal, VestingContractFeature } from '@/components/Ui';
  import CustomProposalTypeSelector from '@/components/Proposals/CustomProposalTypeSelector.vue';
  import CreateTreasurySpendProposal from '@/components/Proposals/TreasurySpendProposals/CreateTreasurySpendProposal.vue';
  import CreateVotingConfigProposal from '@/components/Proposals/VotingConfigProposals/CreateVotingConfigProposal.vue';
  import CreateVestingContractProposal from '@/components/Proposals/CreateVestingContractProposals/CreateVestingContractProposal.vue';
  import CreateVestingClawbackProposal from '@/components/Proposals/VestingClawbackProposals/CreateVestingClawbackProposal.vue';
  import CreateExecuteContractProposal from '@/components/Proposals/ExecuteContractProposals/CreateExecuteContractProposal.vue';
  import CreateGovernanceProposal from '@/components/Proposals/GovernanceProposals/CreateGovernanceProposal.vue';
  import CreateCustomProposal from '@/components/Proposals/CustomProposals/CreateCustomProposal.vue';

  import { CustomProposalTypes } from '@/types';

  defineProps({
    isOpen: { type: Boolean, default: false },
  });
  const emit = defineEmits(['close']);

  const selectedProposalType = ref();
  const selectedProposalSubType = ref();
</script>

<template>
  <DefaultModal class="!max-w-5xl" :is-open="isOpen" @close="emit('close')">
    <div class="flex-1 flex flex-col text-left px-12 py-12">
      <div class="space-y-8">
        <div class="space-y-8" v-if="selectedProposalType">
          <BackButton @click="() => (selectedProposalType = undefined)" />
          <h2 class="title-5">{{ selectedProposalType }} {{ selectedProposalSubType ? `- ${selectedProposalSubType}` : '' }}</h2>
        </div>
        <CustomProposalTypeSelector
          v-model:type="selectedProposalType"
          v-model:sub-type="selectedProposalSubType"
          @close="emit('close')"
          v-else
        />
        <CreateTreasurySpendProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.TreasurySpend" />
        <CreateVotingConfigProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.VotingConfig" />
        <VestingContractFeature>
          <CreateVestingContractProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.CreateVestingContract" />
          <CreateVestingClawbackProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.VestingClawback" />
        </VestingContractFeature>
        <CreateExecuteContractProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.ExecuteContract" />
        <CreateGovernanceProposal
          :proposal-type="selectedProposalSubType"
          @close="emit('close')"
          v-if="selectedProposalType === CustomProposalTypes.Governance"
        />
        <CreateCustomProposal @close="emit('close')" v-if="selectedProposalType === CustomProposalTypes.Custom" />
      </div>
    </div>
  </DefaultModal>
</template>
