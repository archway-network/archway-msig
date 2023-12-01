<template>
  <p v-if="errors" class="text-right caption text-red">
    {{ errors }}
  </p>
</template>

<script setup lang="ts">
  defineProps<{
    errors?: string;
  }>();
</script>
