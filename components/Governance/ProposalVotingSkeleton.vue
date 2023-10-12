<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div>
    <div class="pb-8">
      <LoadingPulse class="w-full h-2" />
    </div>
    <div class="pb-6">
      <div class="flex items-center space-x-4">
        <LoadingPulse class="w-6 h-6 rounded-full" />
        <LoadingPulse class="w-[10rem] h-6 rounded-sm" />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="space-y-2" v-for="_ in new Array(4)">
        <div class="flex items-center space-x-1">
          <LoadingPulse class="w-2 h-2 rounded-full" />
          <LoadingPulse class="w-[2rem] h-3 rounded-sm" />
        </div>
        <div>
          <LoadingPulse class="w-16 h-4" />
        </div>
      </div>
    </div>
  </div>
</template>
