<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="bg-white rounded-2xl p-8">
    <LoadingPulse class="rounded-md w-45 h-8" />
    <div class="pt-8">
      <LoadingPulse class="w-full h-14" />
    </div>
    <div class="flex items-center justify-between pt-6">
      <LoadingPulse class="w-[80px] h-6" />
      <LoadingPulse class="w-[80px] h-6" />
    </div>
  </div>
</template>
