<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';
  import BigNumber from 'bignumber.js';

  import { LoadingPulse } from '@/components/Ui';
  import ClaimRewardsButton from '@/components/Staking/ClaimRewardsButton.vue';
  import TokenWithTooltip from '@/components/Staking/TokenWithTooltip.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useWalletBalance } from '@/data/useWalletBalance';
  import { useAuthStore } from '@/store';

  import { BalancesType } from '@/types';

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { totalSupply, available, rewards, staked, unbonding, loading } = await useWalletBalance(accountId.value, walletAddress, [
    BalancesType.AVAILABLE,
    BalancesType.STAKED,
    BalancesType.REWARDS,
    BalancesType.UNBONDING,
    BalancesType.TOTAL_SUPPLY,
  ]);

  const hasRewards = computed(() => {
    if (!rewards.value) return false;

    return rewards.value.amount.isGreaterThan(BigNumber(0));
  });
</script>

<template>
  <div class="bg-white rounded-2xl">
    <div class="grid grid-cols-2 xl:grid-cols-4 divide-x divide-gray-warm">
      <div class="flex flex-col p-8 xl:py-0 xl:my-8 space-y-6 border-b border-gray-warm xl:border-b-0">
        <div class="flex-1">
          <h4 class="text-gray">Available Tokens</h4>
          <div class="flex flex-col space-y-2">
            <TokenWithTooltip :amount="available" :is-loading="loading || !available" />
            <div class="caption text-gray">
              <LoadingPulse class="w-28 h-4" v-if="loading || !totalSupply" />
              <span v-else> / {{ totalSupply.format(0) }} </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col p-8 xl:py-0 xl:my-8 space-y-6 border-b border-gray-warm xl:border-b-0">
        <div class="flex-1">
          <h4 class="text-gray">Staked Tokens</h4>
          <TokenWithTooltip :amount="staked" :is-loading="loading || !staked" />
        </div>
      </div>
      <div class="flex flex-col p-8 xl:py-0 xl:my-8 space-y-6">
        <div class="flex-1">
          <h4 class="text-gray">Unbonding Tokens</h4>
          <TokenWithTooltip :amount="unbonding" :is-loading="loading || !unbonding" />
        </div>
      </div>
      <div class="flex flex-col p-8 xl:py-0 xl:my-8 space-y-6">
        <div class="flex-1">
          <h4 class="text-gray">Unclaimed Staking Rewards</h4>
          <TokenWithTooltip :amount="rewards" :is-loading="loading || !rewards" />
        </div>
        <ClaimRewardsButton :disabled="!hasRewards" />
      </div>
    </div>
  </div>
</template>
