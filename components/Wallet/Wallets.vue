<script lang="ts" setup>
  import Wallets from '@/domain/Wallets';

  const emit = defineEmits(['select']);

  const wallets = Wallets.all();
</script>

<template>
  <div class="space-y-2">
    <button
      :key="`wallet-${id}`"
      class="w-full flex items-center space-x-2 bg-white px-4 py-4 shadow-[0px_15px_54px_rgba(0,0,0,0.06)]"
      v-for="{ id, name, icon } in wallets"
      @click="() => emit('select', id)"
    >
      <component :is="icon" class="w-6 h-6" />
      <span>{{ name }}</span>
    </button>
  </div>
</template>
