<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { useClipboard } from '@vueuse/core';

  import Tooltip from '@/components/Ui/Misc/Tooltip.vue';
  import { truncateAddress } from '@/utils';

  import { TooltipPosition } from '@/types';

  const props = defineProps({
    address: { type: String, default: '' },
    shortenAddress: { type: Boolean, default: true },
  });

  const attr = useAttrs();

  const { copy, copied } = useClipboard();

  const shortenedAddress = computed(() => truncateAddress(props.address));
</script>

<template>
  <div class="inline-block relative" role="button" @click.prevent="() => copy(address)">
    <div class="flex items-center space-x-1.5">
      <slot></slot>
      <Tooltip text="Click to copy the address" :position="TooltipPosition.BOTTOM" width="220px">
        <span v-bind="attr">{{ shortenedAddress }}</span>
      </Tooltip>
    </div>
    <span class="absolute top-0 right-0 text-xs bg-white text-gray-700 px-1.5 py-1 rounded-sm leading-none" v-show="copied"> Copied </span>
  </div>
</template>
