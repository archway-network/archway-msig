<script lang="tsx" setup>
  import Account from '@/components/Accounts/Account.vue';
  import NoAccounts from '@/components/Accounts/NoAccounts.vue';
  import { useAccounts } from '@/data/useAccounts';

  const { accounts } = useAccounts();
</script>

<template>
  <section class="flex flex-wrap gap-x-10 gap-y-10 md:gap-y-8">
    <Account class="h-full" :account-index="index" :account-id="accountId" v-for="(accountId, index) in accounts" />
    <NoAccounts class="invisible only:visible" />
  </section>
</template>
