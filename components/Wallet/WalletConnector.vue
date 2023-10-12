<script lang="ts" setup>
  import { onMounted, PropType } from 'vue';
  import { Link, LoadingIcon } from '@/components/Ui';
  import { PopoverButton } from '@headlessui/vue';
  import { useWalletStore } from '@/store';

  import { Wallet } from '@/types/wallets';

  const props = defineProps({
    wallet: { type: Object as PropType<Wallet>, required: true },
  });

  const emit = defineEmits(['error']);

  const walletStore = useWalletStore();

  onMounted(async () => {
    try {
      await walletStore.connect(props.wallet.id);
    } catch (err) {
      console.error(err);
      emit('error');
    }
  });
</script>

<template>
  <div>
    <div class="border-b broder-gray-warm space-y-6 pb-8">
      <h4 class="flex items-center space-x-2">
        <component :is="wallet.icon" class="w-6 h-6" />
        <span class="text-gray-800">{{ wallet.name }}</span>
      </h4>
      <div class="flex justify-between items-center">
        <span class="title-3">Connecting</span>
        <span>
          <LoadingIcon class="w-5 h-5 text-black animate-spin" />
        </span>
      </div>
    </div>
    <div class="pt-5">
      <PopoverButton as="template">
        <Link>Cancel</Link>
      </PopoverButton>
    </div>
  </div>
</template>
