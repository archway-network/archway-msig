<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useClipboard } from '@vueuse/core';

  import { useConfig } from '@/composables';
  import { Link, Tooltip } from '@/components/Ui';
  import { useTransactionsStore } from '@/store';
  import { truncateTransaction } from '@/utils';

  import { TooltipPosition } from '@/types';

  defineProps({
    successComponent: { type: Function, optional: true },
  });

  const { externalLinks } = useConfig();
  const { successTransactionId } = storeToRefs(useTransactionsStore());
  const { copy, copied } = useClipboard();
  const attr = useAttrs();

  const transactionLink = computed(() => `${externalLinks.MINTSCAN_TRANSACTIONS}/${successTransactionId.value}`);
  const shortTransactionId = computed(() => truncateTransaction(successTransactionId.value));

  const emit = defineEmits(['close']);
</script>

<template>
  <component :is="successComponent" class="pb-6" />
  <div v-if="successTransactionId" class="pb-6">
    <div @click.prevent="() => copy(successTransactionId)" class="relative mb-2">
      <span class="text-xs border border-gray-700 bg-white text-gray-700 px-1.5 py-1 rounded-lg leading-none absolute right-0 -bottom-5" v-show="copied">Copied</span>
      <Tooltip text="Click to copy the tx hash" :position="TooltipPosition.TOP" width="220px">
        <span v-bind="attr"><span class="text-gray-800">Transaction Id:</span> {{ shortTransactionId }}</span>
      </Tooltip>
    </div>
    <Link :href="transactionLink">View on Mintscan</Link>
  </div>
  <div>
    <Link @click="emit('close')">Dismiss</Link>
  </div>
</template>
