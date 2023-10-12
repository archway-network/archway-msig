<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';

  defineProps({
    rows: { type: Number, default: 10 },
  });
</script>

<template>
  <div class="bg-transparent">
    <div class="space-y-4">
      <LoadingPulse v-for="(_, index) in new Array(rows)" class="w-full h-12" />
    </div>
  </div>
</template>
