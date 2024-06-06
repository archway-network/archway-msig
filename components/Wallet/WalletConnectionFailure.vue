<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { PopoverButton } from '@headlessui/vue';
  import { PrimaryButton, Link, AlertIcon } from '@/components/Ui';

  import { type Wallet } from '@/types/wallets';

  defineProps({
    wallet: { type: Object as PropType<Wallet>, required: true },
  });
</script>

<template>
  <div>
    <div class="border-b broder-gray-warm space-y-6 pb-8">
      <div class="space-y-2">
        <AlertIcon class="w-6 h-6" />
        <h4 class="title-3">Cannot launch<br />{{ wallet.name }}</h4>
      </div>
      <p class="text-gray-800">The {{ wallet.name }} extension could not connect to Archway Connect.</p>
      <div class="pt-2" v-if="wallet.troubleshootUrl">
        <Link :href="wallet.troubleshootUrl">Troubleshooting</Link>
      </div>
    </div>
    <div class="pt-6">
      <PopoverButton as="template">
        <PrimaryButton class="w-full">Try Again</PrimaryButton>
      </PopoverButton>
    </div>
  </div>
</template>
