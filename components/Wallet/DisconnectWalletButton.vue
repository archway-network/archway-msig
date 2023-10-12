<script lang="ts" setup>
  import { TransparentButton, DisconnectWalletIcon } from '@/components/Ui';
  import { useAuthStore } from '@/store';

  const authStore = useAuthStore();
</script>

<template>
  <TransparentButton class="px-0" @click="() => authStore.signOut()">
    <DisconnectWalletIcon class="w-4 h-4" />
  </TransparentButton>
</template>
