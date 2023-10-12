<script lang="ts" setup>
  import AlertIcon from '@/components/Ui/Icons/AlertIcon.vue';

  defineProps({
    imageSrc: { type: String, required: false },
  });
</script>

<template>
  <div class="border border-orange rounded-lg px-4 pt-4 pb-6">
    <img v-if="imageSrc" :src="imageSrc" class="mb-8 rounded-lg w-full" />
    <div class="flex space-x-4">
      <div class="flex-shrink-0">
        <slot name="icon">
          <AlertIcon class="w-6 h-6 text-orange" />
        </slot>
      </div>
      <div class="flex-1">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
