<script lang="ts" setup>
  import { ref } from 'vue';
  import { TransitionRoot } from '@headlessui/vue';
  import WalletSelector from '@/components/Wallet/WalletSelector.vue';
  import WalletConnector from '@/components/Wallet/WalletConnector.vue';
  import WalletConnectionFailure from '@/components/Wallet/WalletConnectionFailure.vue';
  import { Wallets } from '@/domain';

  import { Wallet, WalletType } from '@/types/wallets';

  const selectedWallet = ref<Wallet | undefined>();
  const hasErrors = ref<boolean>(false);

  const showWalletSelector = computed(() => selectedWallet.value === undefined);
  const showWalletConnector = computed(() => selectedWallet.value !== undefined && !hasErrors.value);
  const showWalletConnectionFailure = computed(() => selectedWallet.value !== undefined && hasErrors.value);

  const selectWallet = (wallet: WalletType) => {
    selectedWallet.value = Wallets.find(wallet);
  };

  const setErrors = () => {
    hasErrors.value = true;
  };
</script>

<template>
  <div>
    <TransitionRoot
      as="template"
      appear
      :show="showWalletSelector"
      enter="transform transition duration-300 ease-in-out"
      enter-from="opacity-0 translate-x-full"
      enter-to="opacity-100"
    >
      <WalletSelector @select="selectWallet" />
    </TransitionRoot>
    <TransitionRoot
      as="template"
      :show="showWalletConnector"
      enter="transform transition duration-300 ease-in-out"
      enter-from="opacity-0 translate-x-full"
      enter-to="opacity-100"
    >
      <WalletConnector :wallet="selectedWallet" @error="setErrors" />
    </TransitionRoot>
    <TransitionRoot
      as="template"
      :show="showWalletConnectionFailure"
      enter="transform transition duration-300 ease-in-out"
      enter-from="opacity-0 translate-x-full"
      enter-to="opacity-100"
    >
      <WalletConnectionFailure :wallet="selectedWallet" />
    </TransitionRoot>
  </div>
</template>
