<script lang="ts" setup>
  import { type PropType } from 'vue';
  import DepositPeriodLabel from '@/components/Governance/Labels/DepositPeriodLabel.vue';
  import InProgressLabel from '@/components/Governance/Labels/InProgressLabel.vue';
  import FailedLabel from '@/components/Governance/Labels/FailedLabel.vue';
  import PassedLabel from '@/components/Governance/Labels/PassedLabel.vue';
  import RejectedLabel from '@/components/Governance/Labels/RejectedLabel.vue';

  import { GovernanceProposalStatus } from '@/types';

  defineProps({
    status: { type: Number as PropType<GovernanceProposalStatus>, required: true },
  });
</script>

<template>
  <DepositPeriodLabel v-if="status === GovernanceProposalStatus.DEPOSIT_PERIOD" />
  <InProgressLabel v-if="status === GovernanceProposalStatus.IN_PROGRESS" />
  <PassedLabel v-if="status === GovernanceProposalStatus.PASSED" />
  <RejectedLabel v-if="status === GovernanceProposalStatus.REJECTED" />
  <FailedLabel v-if="status === GovernanceProposalStatus.FAILED" />
</template>
