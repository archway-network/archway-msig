<script lang="ts" setup>
  import { useClipboard } from '@vueuse/core';
  import { useWalletStore } from '@/store';

  const walletStore = useWalletStore();

  const { copy, copied } = useClipboard();
</script>

<template>
  <div>
    <dl>
      <dt>{{ walletStore.wallet?.accountName }}</dt>
      <dd class="small" role="button" @click.prevent="() => copy(walletStore.wallet?.address.address || '')">
        {{ walletStore.wallet?.address.shortAddress }}
        <span class="text-xs bg-white text-gray-700 px-1.5 py-1 rounded-sm leading-none" v-show="copied">Copied</span>
      </dd>
    </dl>
  </div>
</template>
