<script lang="ts" setup>
  import { LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-4" v-for="_ in new Array(2)">
      <div class="flex-1">
        <LoadingPulse class="rounded-xl h-6" />
      </div>
      <div class="w-[100px] flex-shrink-0">
        <LoadingPulse class="rounded-xl h-6" />
      </div>
      <div class="w-[110px] flex-shrink-0">
        <LoadingPulse class="rounded-xl h-6" />
      </div>
    </div>
  </div>
</template>
