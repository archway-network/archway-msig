<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';

  import AccountCard from '@/components/Accounts/AccountCard.vue';
  import { useAuthStore } from '@/store';
  import { useAccountId } from '@/data/useAccountId';

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
</script>

<template>
  <div v-if="!!walletAddress && !!accountId">
    <AccountCard :accountId="accountId" />
  </div>
</template>
