<script lang="ts" setup>
  import { PropType } from 'vue';
  import { storeToRefs } from 'pinia';

  import { AlertCard, LoadingPulse, Tokens } from '@/components/Ui';
  import RequiredDeposit from '@/components/Governance/RequiredDeposit.vue';
  import { GovernanceProposal } from '@/domain';
  import { useWalletBalance } from '@/data/useWalletBalance';
  import { useAccountId } from '@/data/useAccountId';
  import { useAuthStore } from '@/store';
  import { BalancesType } from '@/types';

  defineProps({
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
  });

  const { isAuthenticated, walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const { staked, loading } = await useWalletBalance(accountId.value, walletAddress, [BalancesType.STAKED]);
</script>

<template>
  <div class="space-y-5">
    <RequiredDeposit :total-deposit="proposal.totalDeposit" v-if="proposal.isInDepositPeriod()" />
    <dl class="flex justify-between items-center">
      <dt class="caption font-medium">Total Deposit</dt>
      <dd>
        <Tokens>{{ proposal.totalDeposit.format() }}</Tokens>
      </dd>
    </dl>
    <dl class="flex justify-between items-center">
      <dt class="caption font-medium">{{ proposal.isInDepositPeriod() ? 'Submitted on' : 'Voting Started' }}</dt>
      <dd>
        {{ proposal.isInDepositPeriod() ? proposal.formatted.submittedOn : proposal.formatted.votingStart }}
      </dd>
    </dl>
    <dl class="flex justify-between items-center">
      <dt class="caption font-medium">{{ proposal.isInDepositPeriod() ? 'Deposit Deadline' : 'Voting Deadline' }}</dt>
      <dd>
        {{ proposal.isInDepositPeriod() ? proposal.formatted.depositDeadline : proposal.formatted.votingDeadline }}
      </dd>
    </dl>
    <div v-if="isAuthenticated && proposal.isInProgress()">
      <dl class="flex justify-between items-center">
        <dt class="caption font-medium">Your Voting Power</dt>
        <dd>
          <LoadingPulse v-if="loading" class="w-16 h-6" />
          <span v-else>{{ staked?.formatWithCoin() }}</span>
        </dd>
      </dl>
      <AlertCard class="mt-4 !p-4" v-if="staked?.amount.isZero()"> You need to stake tokens to be able to vote </AlertCard>
    </div>
  </div>
</template>
