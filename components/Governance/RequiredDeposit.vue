<script lang="ts" setup>
  import { PropType } from 'vue';

  import { Tokens } from '@/components/Ui';
  import { TokenAmount } from '@/domain';
  import { useGovernanceParams } from '@/data/useGovernanceParams';

  const props = defineProps({
    totalDeposit: { type: Object as PropType<TokenAmount>, required: true },
  });

  const { params, loading } = await useGovernanceParams();

  const requiredDeposit = computed(() => {
    if (!params.value) return TokenAmount.zero(props.totalDeposit.denom);

    const calculatedMissing = params.value.minDeposit.minus(props.totalDeposit);

    return calculatedMissing.amount.isNegative() ? TokenAmount.zero(props.totalDeposit.denom) : calculatedMissing;
  });
</script>

<template>
  <dl class="flex justify-between items-center" v-if="!loading">
    <dt class="caption font-medium">Required Deposit</dt>
    <dd>
      <Tokens>{{ requiredDeposit.format() }}</Tokens>
    </dd>
  </dl>
</template>
