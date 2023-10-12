<script lang="ts" setup>
  defineProps({
    label: { type: String, required: true },
  });
</script>

<template>
  <dl>
    <dt class="text-gray pb-0.5">{{ label }}</dt>
    <dd>
      <slot></slot>
    </dd>
  </dl>
</template>
