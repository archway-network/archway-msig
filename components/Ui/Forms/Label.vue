<script lang="ts" setup>
  defineProps({
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
  });
</script>

<template>
  <label class="label" v-if="label"> {{ label }}{{ required ? '*' : '' }} </label>
</template>
