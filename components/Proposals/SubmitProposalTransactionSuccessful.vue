<script lang="ts" setup>
  defineProps<{
    title?: string;
    description?: string;
  }>();
</script>

<template>
  <div>
    <img class="w-full h-[141px]" src="@/assets/images/transaction-successfull.png" alt="" />
    <div class="title-3 pt-4 pb-6">{{ title ?? 'Congratulations!' }}</div>
    <p class="text-gray-800">{{ description ?? 'Your proposal has been successfully submitted.' }}</p>
  </div>
</template>
