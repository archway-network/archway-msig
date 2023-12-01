<script setup lang="ts">
  import { InformationCircleIcon } from '@heroicons/vue/20/solid';

  type Props = {
    type?: 'warning' | 'info' | 'error';
  };

  withDefaults(defineProps<Props>(), { type: 'info' });
</script>

<template>
  <div
    class="rounded-md p-4 bg-opacity-10"
    :class="{
      'bg-yellow': type === 'warning',
      'bg-blue': type === 'info',
      'bg-red': type === 'error',
    }"
  >
    <div class="flex gap-3">
      <div class="flex-shrink-0">
        <slot name="icon">
          <InformationCircleIcon
            class="h-5 w-5"
            :class="{
              'text-yellow': type === 'warning',
              'text-blue': type === 'info',
              'text-red': type === 'error',
            }"
            aria-hidden="true"
          />
        </slot>
      </div>
      <div class="text-sm">
        <p><slot /></p>
      </div>
    </div>
  </div>
</template>
