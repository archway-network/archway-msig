<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';

  import { LoadingPulse } from '@/components/Ui';
  import { useAccountId } from '@/data/useAccountId';
  import { useAccount } from '@/data/useAccount';
  import useAuthStore from '@/store/useAuthStore';

  defineProps({
    compact: { type: Boolean, default: false },
  });

  const { walletAddress } = storeToRefs(useAuthStore());

  const { accountId } = useAccountId();

  const { account: selectedAccount, loading: loadingAccount } = await useAccount(accountId.value, walletAddress);
</script>

<template>
  <div>
    <LoadingPulse v-if="loadingAccount" class="w-4 h-4" />
    <div class="flex flex-row items-center justify-center" :class="[compact && 'h-4']" v-else>
      <div class="w-4 h-4 items-center justify-center rounded-full bg-gray-warm caption uppercase">
        {{ selectedAccount?.title.charAt(0) }}
      </div>
      <div v-if="!compact" class="pl-2 text-black">{{ selectedAccount?.title }}</div>
    </div>
  </div>
</template>
