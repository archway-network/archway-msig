<script lang="ts" setup>
  import { type PropType } from 'vue';

  import InfoIcon from '@/components/Ui/Icons/InfoIcon.vue';

  import { TooltipPosition } from '@/types';

  defineProps({
    text: { type: String },
    position: { type: String as PropType<TooltipPosition>, default: TooltipPosition.TOP },
    disabled: { type: Boolean, default: false },
    maxWidth: { type: String, default: 'auto' },
    width: { type: String, default: 'auto' },
  });
  const slots = useSlots();
</script>

<template>
  <div class="group relative z-20">
    <div class="cursor-pointer">
      <slot> <InfoIcon class="w-4 h-4" /> </slot>
    </div>
    <div
      :class="[
        `absolute hidden group-hover:block rounded-lg shadow-[40px_64px_128px_-8px_rgba(0,0,0,0.14)] z-50`,
        {
          'left-1/2 top-0 -translate-y-full -translate-x-1/2': position === TooltipPosition.TOP,
          'left-0 top-0 -translate-y-full': position === TooltipPosition.TOP_LEFT,
          'right-0 top-0 -translate-y-full': position === TooltipPosition.TOP_RIGHT,
          'right-0 top-1/2 -translate-y-1/2 translate-x-full': position === TooltipPosition.RIGHT,
          'left-1/2 bottom-0 translate-y-full -translate-x-1/2': position === TooltipPosition.BOTTOM,
          'left-0 bottom-0 translate-y-full': position === TooltipPosition.BOTTOM_LEFT,
          'right-0 bottom-0 translate-y-full': position === TooltipPosition.BOTTOM_RIGHT,
          'left-0 top-1/2 -translate-y-1/2 -translate-x-full': position === TooltipPosition.LEFT,
        },
      ]"
      v-if="slots.content && !disabled"
    >
      <slot name="content"> </slot>
    </div>
    <span
      v-else-if="!disabled"
      :class="[
        `absolute hidden group-hover:block px-3 py-2 bg-black rounded-lg shadow-[40px_64px_128px_-8px_rgba(0,0,0,0.14)] text-center text-white caption z-50`,
        {
          'left-1/2 top-0 -translate-y-full -translate-x-1/2': position === TooltipPosition.TOP,
          'left-0 top-0 -translate-y-full': position === TooltipPosition.TOP_LEFT,
          'right-0 top-0 -translate-y-full': position === TooltipPosition.TOP_RIGHT,
          'right-0 top-1/2 -translate-y-1/2 translate-x-full': position === TooltipPosition.RIGHT,
          'left-1/2 bottom-0 translate-y-full -translate-x-1/2': position === TooltipPosition.BOTTOM,
          'left-0 bottom-0 translate-y-full': position === TooltipPosition.BOTTOM_LEFT,
          'right-0 bottom-0 translate-y-full': position === TooltipPosition.BOTTOM_RIGHT,
          'left-0 top-1/2 -translate-y-1/2 -translate-x-full': position === TooltipPosition.LEFT,
        },
      ]"
      :style="{ maxWidth, width }"
    >
      {{ text }}
    </span>
  </div>
</template>
