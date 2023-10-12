<script lang="ts" setup>
  import { PropType } from 'vue';

  import { Link, SecondaryButton, AlertIcon } from '@/components/Ui';

  import { Wallet } from '@/types/wallets';

  defineProps({
    wallet: { type: Object as PropType<Wallet>, required: true },
    errorMessage: { type: String, default: '' },
  });

  const emit = defineEmits(['close']);
</script>

<template>
  <div class="border-b border-gray-warm space-y-3 pb-8">
    <AlertIcon class="w-5 h-5" />
    <div class="title-3">{{ errorMessage ? 'Transaction Failed' : `Cannot launch ${wallet.name}` }}</div>
    <div class="text-gray-800 pb-2 break-words" v-if="errorMessage">{{ errorMessage }}</div>
    <div v-else>
      <div class="text-gray-800 pb-2">The {{ wallet.name }} extension could not connect to Archway Connect</div>
      <Link :href="wallet.troubleshootUrl" v-if="wallet.troubleshootUrl">Troubleshooting</Link>
    </div>
  </div>
  <div class="pt-5 space-y-2">
    <!-- <PrimaryButton class="w-full" @click="emit('retry')">Try Again</PrimaryButton> -->
    <SecondaryButton class="w-full" @click="emit('close')">Close</SecondaryButton>
  </div>
</template>
