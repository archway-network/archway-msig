<script lang="ts" setup>
  import { PropType } from 'vue';

  import Tooltip from '@/components/Ui/Misc/Tooltip.vue';
  import InfoIcon from '@/components/Ui/Icons/InfoIcon.vue';

  import { TooltipPosition } from '@/types';

  defineProps({
    text: { type: String, required: true },
    position: { type: String as PropType<TooltipPosition>, default: undefined },
    disabled: { type: Boolean, default: false },
    maxWidth: { type: String, default: undefined },
    width: { type: String, default: undefined },
  });
</script>

<template>
  <span class="inline-flex items-center space-x-2">
    <span>
      <slot></slot>
    </span>
    <Tooltip :text="text" :position="position" :disabled="disabled" :max-width="maxWidth" :width="width">
      <InfoIcon class="w-4 h-4" />
    </Tooltip>
  </span>
</template>
