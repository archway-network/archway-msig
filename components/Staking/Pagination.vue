<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    currentPageToken: { type: String, default: undefined },
  });
</script>

<template>
  <div class="flex flex-1 justify-between sm:justify-end">
    <a
      href="#"
      class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
    >
      Previous
    </a>
    <a
      href="#"
      class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
    >
      Next
    </a>
  </div>
</template>
