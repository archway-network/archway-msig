<script lang="ts" setup>
  import { type PropType } from 'vue';

  import { LoadingIcon } from '@/components/Ui';

  import { type Wallet } from '@/types/wallets';

  defineProps({
    wallet: { type: Object as PropType<Wallet>, required: true },
  });
</script>

<template>
  <div class="space-y-6 pb-8">
    <h4 class="flex items-center space-x-2">
      <component :is="wallet?.icon" class="w-6 h-6 text-red" />
      <span class="text-gray-800">{{ wallet?.name }}</span>
    </h4>
    <div class="flex justify-between items-center">
      <span class="title-3">Connecting</span>
      <span>
        <LoadingIcon class="w-5 h-5 text-black animate-spin" />
      </span>
    </div>
  </div>
  <!-- <div class="pt-5 border-t border-gray-warm ">
    <Link @click="$emit('cancel')">Cancel</Link>
  </div> -->
</template>
