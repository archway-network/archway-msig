<script lang="tsx" setup>
  import { InformationCircleIcon } from '@heroicons/vue/20/solid';
</script>

<template>
  <div class="rounded-md bg-yellow/10 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <InformationCircleIcon class="h-5 w-5 text-yellow" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium">Advanced territory</h3>
        <div class="mt-2 text-sm">
          <p>Execute custom and bulk actions.</p>
        </div>
      </div>
    </div>
  </div>
</template>
