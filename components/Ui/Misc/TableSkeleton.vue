<script lang="ts" setup>
  defineProps({
    rows: { type: Number, default: 4 },
  });
</script>

<template>
  <div class="bg-transparent">
    <UiMiscLoadingPulse class="my-2 w-full h-16 rounded-full" />
    <div class="space-y-4 border-t border-gray-warm pt-2 ">
      <UiMiscLoadingPulse v-for="(_, index) in new Array(rows)" class="w-full h-12" />
    </div>
  </div>
</template>
