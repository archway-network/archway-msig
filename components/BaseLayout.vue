<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import MobileGate from '@/components/MobileGate.vue';
  import Guest from '@/components/Guest.vue';
  import TransactionModal from '@/components/TransactionModal.vue';
  import { useConfig } from '@/composables';
  import { useAuthStore } from '@/store';

  const attr = useAttrs();

  const { isMainNet } = useConfig();

  const auth = useAuthStore();

  onMounted(() => {
    // Make this non blocking, so the UI displays the LoadingIcon while user authenticates
    auth.init();
  });
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col flex-1">
      <MobileGate />
      <Guest class="hidden lg:flex" v-if="!auth.isAuthenticated" />
      <div class="hidden lg:flex flex-col flex-1 relative" v-else>
        <div class="flex-1 flex flex-col z-20">
          <div v-bind="attr" class="hidden lg:flex flex-col flex-1 w-full mr-auto ml-auto max-w-[1920px] bg-gray-warm">
            <slot :is-auth-loading="auth.loading" :is-authenticated="auth.isAuthenticated" :is-mainnet="isMainNet"></slot>
          </div>
        </div>
      </div>
      <TransactionModal />
    </div>
  </ClientOnly>
</template>

<style>
  /* To make the wallet transaction dialog (Global Modals) always display on top of everything, even other open dialogs */
  #headlessui-portal-root > div:first-of-type {
    position: fixed;
    z-index: 100;
    right: 16px;
    bottom: 16px;
  }
</style>
