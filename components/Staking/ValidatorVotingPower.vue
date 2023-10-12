<script lang="ts" setup>
  import { PropType } from 'vue';

  import { Validator, TokenAmount } from '@/domain';

  defineProps({
    validator: { type: Object as PropType<Validator>, required: true },
    totalDelegated: { type: Object as PropType<TokenAmount>, required: true },
  });
</script>

<template>
  <span>
    {{ formatPercent(validator.votingPower.toBigNumber().div(totalDelegated?.toBigNumber()).times(100)) }}
  </span>
</template>
