<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <LoadingPulse class="rounded-xl w-40 h-6" />
      <LoadingPulse class="rounded-xl w-full h-32" />
    </div>
    <div class="flex gap-6">
      <div class="w-1/2">
        <div class="space-y-2">
          <LoadingPulse class="rounded-xl w-40 h-6" />
          <LoadingPulse class="rounded-xl w-full h-12" />
        </div>
      </div>
      <div class="w-1/2">
        <div class="space-y-2">
          <LoadingPulse class="rounded-xl w-40 h-6" />
          <LoadingPulse class="rounded-xl w-full h-12" />
        </div>
      </div>
    </div>
    <div class="flex gap-6">
      <div class="w-1/2">
        <div class="space-y-2">
          <div class="flex justify-between">
            <LoadingPulse class="rounded-xl w-40 h-6" />
            <LoadingPulse class="rounded-full w-20 h-8" />
          </div>
          <LoadingPulse class="rounded-xl w-full h-12" />
        </div>
      </div>
      <div class="w-1/2 flex justify-between">
        <LoadingPulse class="rounded-xl w-40 h-6" />
        <LoadingPulse class="rounded-full w-20 h-8" />
      </div>
    </div>
  </div>
  <div class="flex flex-row justify-between pt-8">
    <LoadingPulse class="rounded-xl w-28 h-8" />
    <div class="flex flex-row space-x-2">
      <LoadingPulse class="rounded-xl w-40 h-12" />
    </div>
  </div>
</template>
