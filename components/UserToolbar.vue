<script setup>
  import WalletName from '@/components/Wallet/WalletName';
  import ConnectWalletButton from '@/components/Wallet/ConnectWalletButton';
  import DisconnectWalletButton from '@/components/Wallet/DisconnectWalletButton';
  import { useAuthStore } from '@/store';

  const auth = useAuthStore();
</script>

<template>
  <div>
    <div class="flex items-center space-x-4" v-if="auth.isAuthenticated">
      <WalletName />
      <DisconnectWalletButton />
    </div>
    <ConnectWalletButton v-else />
  </div>
</template>
