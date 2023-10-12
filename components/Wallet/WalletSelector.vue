<script lang="ts" setup>
  import Wallets from '@/components/Wallet/Wallets.vue';

  import { WalletType } from '@/types/wallets';

  const emit = defineEmits(['select']);

  const selectWallet = (wallet: WalletType) => {
    emit('select', wallet);
  };
</script>

<template>
  <div>
    <h4 class="pb-4">Choose a wallet to connect</h4>
    <p class="text-gray-800">Select from the supported wallets to get started.</p>
    <Wallets class="pt-8" @select="selectWallet" />
    <TestNetworksDisclaimer class="pt-8" />
  </div>
</template>
