<script setup>
  import BaseButton from './BaseButton.vue';
</script>

<template>
  <BaseButton
    :class="['bg-black text-white hover:bg-black/80 hover:text-white', 'disabled:bg-white disabled:drop-shadow-button disabled:text-gray']"
  >
    <slot></slot>
  </BaseButton>
</template>
