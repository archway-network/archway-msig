<script lang="ts" setup>
  defineProps({
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
  });
</script>

<template>
  <label class="block pb-2 caption text-gray-800" v-if="label"> {{ label }}{{ required ? '*' : '' }} </label>
</template>
