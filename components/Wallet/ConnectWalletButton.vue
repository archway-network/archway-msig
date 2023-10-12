<script lang="ts" setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import { PrimaryButton, CloseIcon } from '@/components/Ui';
  import ConnectWallet from '@/components/Wallet/ConnectWallet.vue';
  import { ref } from 'vue';
  import useWalletStore from '@/store/useWalletStore';

  const walletConnectRef = ref<InstanceType<typeof PopoverButton>>();
  const walletStore = useWalletStore();

  watch(
    () => walletStore.walletConnectValue,
    () => {
      walletConnectRef.value?.$el.click();
    }
  );
</script>

<template>
  <div>
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton as="template">
        <div>
          <PrimaryButton class="!w-12 !px-0 justify-center items-center" :class="{ hidden: !open, flex: open }">
            <CloseIcon class="w-4 h-4" />
          </PrimaryButton>
          <PrimaryButton v-show="!open" ref="walletConnectRef">Connect Wallet</PrimaryButton>
        </div>
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute w-[327px] right-0 transform mt-2 z-40">
          <div class="overflow-hidden bg-white rounded-2xl shadow-[-8px_0px_124px_rgba(0,0,0,0.16)]">
            <ConnectWallet class="px-8 py-8" />
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>
