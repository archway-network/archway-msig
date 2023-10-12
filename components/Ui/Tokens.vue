<script setup>
  import ArchwayToken from '@/components/Ui/Icons/ArchwayToken.vue';

  const props = defineProps({
    before: { type: Boolean, default: false },
    icon: { type: String },
    wrappedWithSpan: { type: Boolean, default: true },
  });
</script>

<template>
  <div class="inline-flex items-center space-x-2.5">
    <img v-if="before && icon" class="rounded-full w-6 h-6" :src="icon" />
    <ArchwayToken v-if="before && !icon" class="w-6 h-6 flex-shrink-0" />
    <span v-if="wrappedWithSpan">
      <slot></slot>
    </span>
    <slot v-else></slot>
    <img v-if="!before && icon" class="rounded-full w-6 h-6" :src="icon" />
    <ArchwayToken v-if="!before && !icon" class="w-6 h-6 flex-shrink-0" />
  </div>
</template>
