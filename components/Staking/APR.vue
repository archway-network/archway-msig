<script setup>
  import { storeToRefs } from 'pinia';
  import BigNumber from 'bignumber.js';

  import { TooltipWithIcon } from '@/components/Ui';
  import { LoadingPulse } from '@/components/Ui';
  import { useWalletBalance } from '@/data/useWalletBalance';
  import { useInflation } from '@/data/useInflation';
  import { useChainTotalDelegations } from '@/data/useChainTotalDelegations';
  import { useAuthStore } from '@/store';
  import { formatPercent } from '@/utils';

  import { BalancesType, TooltipPosition } from '@/types';

  const { walletAddress } = storeToRefs(useAuthStore());
  const { totalSupply, loading: loadingBalances } = await useWalletBalance(walletAddress, [BalancesType.TOTAL_SUPPLY]);
  const { inflation, loading: loadingInflation } = await useInflation();
  const { totalDelegated, loading: totalDelegatedLoading } = await useChainTotalDelegations();

  const loading = computed(() => loadingBalances.value || loadingInflation.value || totalDelegatedLoading.value);

  // APR FORMULA:
  // (Inflation x (1-DevInflationRewards)) / (Number of Staked Tokens / Total Supply)
  const DevInflationRewards = 0.25;
  const apr = computed(() => {
    return BigNumber(inflation.value)
      .times(BigNumber(1).minus(DevInflationRewards))
      .div(totalDelegated.value.toBigNumber().div(totalSupply.value.toBigNumber()))
      .times(100);
  });
</script>

<template>
  <div class="h-12 flex items-center border border-gray-warm rounded-full px-6">
    <div v-if="loading">
      <LoadingPulse class="w-16 h-6" />
    </div>
    <div v-else>
      <TooltipWithIcon
        class="text-gray"
        text="APR is the estimated percentage of your staked tokens that you will earn, on top of your staked tokens. The validators commission will be subtracted from it."
        width="220px"
        :position="TooltipPosition.TOP_RIGHT"
      >
        <span class="text-black">{{ formatPercent(apr) }}</span>
        <span> APR</span>
      </TooltipWithIcon>
    </div>
  </div>
</template>
