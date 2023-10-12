<script lang="ts" setup>
  import { useConfig } from '@/composables';

  const {
    appAssets: { logo },
  } = useConfig();
</script>

<template>
  <img class="w-6 h-6 flex-shrink-0" :src="logo" />
</template>
