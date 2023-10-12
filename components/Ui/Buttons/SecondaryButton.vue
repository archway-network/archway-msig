<script setup>
  import BaseButton from './BaseButton.vue';
</script>

<template>
  <BaseButton
    :class="[
      'bg-white text-orange hover:text-orange/75',
      'disabled:text-gray disabled:hover:drop-shadow-button',
      'drop-shadow-button hover:drop-shadow-button-hov',
    ]"
    is-secondary
  >
    <slot></slot>
  </BaseButton>
</template>
