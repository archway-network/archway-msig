<script lang="tsx" setup>
  import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
</script>

<template>
  <div class="rounded-md bg-yellow/10 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationTriangleIcon class="h-5 w-5 text-yellow" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium">Attention needed</h3>
        <div class="mt-2 text-sm">
          <p>This vesting contract has the clawback feature disabled.</p>
        </div>
      </div>
    </div>
  </div>
</template>
