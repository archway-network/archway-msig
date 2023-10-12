<script lang="ts" setup>
  import { useConfig } from '@/composables';

  const {
    appAssets: { brand },
    isMainNet,
  } = useConfig();
</script>

<template>
  <div class="flex flex-row flex-shrink-0 items-center h-6">
    <img class="h-full" :src="brand" v-if="brand" />
    <span class="caption leading-none pt-1" v-if="!isMainNet">.dev</span>
  </div>
</template>
