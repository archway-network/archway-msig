<script lang="tsx" setup>
  defineProps({
    title: { type: String, required: true },
  });
</script>

<template>
  <ClientOnly>
    <Teleport to="#header-title">
      <h1 class="h-[3rem] title-1">{{ title }}</h1>
    </Teleport>
  </ClientOnly>
</template>
