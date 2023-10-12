<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="bg-white rounded-2xl p-8 space-y-8">
    <div class="flex justify-between">
      <LoadingPulse class="rounded-full w-16 h-8" />
      <LoadingPulse class="rounded-full w-16 h-8" />
    </div>
    <LoadingPulse class="w-full h-6" />
    <LoadingPulse class="w-full h-1" />
    <div class="flex space-x-8">
      <div class="w-1/2">
        <LoadingPulse class="mb-2 w-full h-3" />
        <LoadingPulse class="w-full h-4" />
      </div>
      <div class="w-1/2">
        <LoadingPulse class="mb-2 w-full h-3" />
        <LoadingPulse class="w-full h-4" />
      </div>
    </div>
  </div>
</template>
