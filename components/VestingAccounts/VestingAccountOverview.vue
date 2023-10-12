<script lang="ts" setup>
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import BigNumber from 'bignumber.js';

  import { DescriptionList, Tokens } from '@/components/Ui';
  import VestingAccountOverviewSkeleton from '@/components/VestingAccounts/VestingAccountOverviewSkeleton.vue';
  import WithdrawTokensButton from '@/components/VestingAccounts/WithdrawTokensButton.vue';
  import ClaimRewardsButton from '@/components/VestingAccounts/ClaimRewardsButton.vue';
  import WithdrawRewardsButton from '@/components/VestingAccounts/WithdrawRewardsButton.vue';

  import { useVestingAccount } from '@/data/useVestingAccount';
  import { useAuthStore } from '@/store';
  import { useWalletBalance } from '@/data/useWalletBalance';
  import { useAccountId } from '@/data/useAccountId';

  import { BalancesType } from '@/types';

  const props = defineProps<{
    vestingAccountId: string;
  }>();

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { account: vestingAccount, loading: loadingVestingAccount } = await useVestingAccount(
    accountId,
    props.vestingAccountId,
    walletAddress
  );
  const { rewards, loading: loadingStakingRewards } = await useWalletBalance(props.vestingAccountId, walletAddress, [BalancesType.REWARDS]);

  const loading = computed(() => loadingVestingAccount.value || loadingStakingRewards.value);

  const canClaimRewards = computed(() => {
    if (!rewards.value) return false;

    return rewards.value.amount.isGreaterThan(BigNumber(0));
  });
</script>

<template>
  <div class="flex flex-col bg-white rounded-2xl px-8 py-8 mb-8">
    <VestingAccountOverviewSkeleton v-if="loading" />
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8" v-else>
      <div>
        <div class="flex justify-between items-center">
          <DescriptionList label="Vesting Start"> {{ vestingAccount?.formatted.startDate }} </DescriptionList>
          <DescriptionList class="text-right" label="Cliff"> {{ vestingAccount?.formatted.cliffDateDistanceToNow }} </DescriptionList>
        </div>
        <div class="py-6">
          <div class="h-[2px] bg-gray-warm relative">
            <div class="absolute inset-y-0 left-0 bg-green-700" :style="`width: ${vestingAccount?.progressToCliff}%`" />
          </div>
        </div>
        <DescriptionList label="Amount unlocked at cliff">
          <Tokens class="title-3">{{ vestingAccount?.cliffUnlockAmount.format() }}</Tokens>
        </DescriptionList>
      </div>
      <div class="col-span-2">
        <div class="flex justify-end items-center space-x-6">
          <DescriptionList class="text-right" label="Total Tokens">
            <div class="text-right">
              <Tokens>{{ vestingAccount?.initialAmount.format() }}</Tokens>
            </div>
          </DescriptionList>
          <DescriptionList class="text-right" label="Vesting End"> {{ vestingAccount?.formatted.endDate }} </DescriptionList>
        </div>
        <div class="py-6">
          <div class="h-[2px] bg-gray-warm relative">
            <div class="absolute inset-y-0 left-0 bg-green-700" :style="`width: ${vestingAccount?.progressToFullVesting}%`" />
          </div>
        </div>
        <div class="flex gap-12 pb-4">
          <div class="flex-1">
            <DescriptionList label="Unlocked Tokens">
              <Tokens class="title-3">{{ vestingAccount?.unlockedAmount.format() }}</Tokens>
            </DescriptionList>
            <div class="pt-4 space-y-1">
              <DescriptionList class="flex items-center justify-between" label="Withdrawable">
                {{ vestingAccount?.withdrableAmount.format() }}
              </DescriptionList>
              <DescriptionList class="flex items-center justify-between" label="Withdrawn">
                {{ vestingAccount?.withdrawnAmount.format() }}
              </DescriptionList>
            </div>
          </div>
          <div class="flex-1">
            <div class="divide-y divide-gray-warm">
              <div class="flex justify-between pb-4">
                <DescriptionList class="flex-1" label="Total Staked"> {{ vestingAccount?.stakedAmount.format() }} </DescriptionList>
                <DescriptionList class="flex-1 text-right" label="Unbonding">
                  {{ vestingAccount?.unbondingAmount.format() }}
                </DescriptionList>
              </div>
              <div class="pt-4 space-y-1">
                <DescriptionList class="flex items-center justify-between" label="Unclaimed Staking Rewards">
                  {{ rewards?.format() }}
                </DescriptionList>
                <DescriptionList class="flex items-center justify-between" label="Withdrawable Rewards">
                  {{ vestingAccount?.withdrableStakingRewardsAmount.format() }}
                </DescriptionList>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 pt-4 mt-4 border-t border-gray-warm">
          <div class="flex justify-between">
            <div>
              <WithdrawTokensButton :vesting-account-id="vestingAccountId" :disabled="!vestingAccount?.canWithdrawTokens" />
            </div>
            <div class="space-x-4">
              <ClaimRewardsButton :vesting-account-id="vestingAccountId" :disabled="!canClaimRewards" />
              <WithdrawRewardsButton :vesting-account-id="vestingAccountId" :disabled="!vestingAccount?.canWithdrawStakingRewards" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
