<script setup>
  import AccountToolbar from '@/components/AccountToolbar.vue';
  import UserToolbar from '@/components/UserToolbar.vue';
  import { useAccountId } from '@/data/useAccountId';

  const { accountId } = useAccountId();
</script>

<template>
  <div class="py-8 flex justify-between items-center">
    <div id="header-title" class="flex-1 mr-8" />
    <div class="flex flex-row divide-x">
      <AccountToolbar class="pr-4" />
      <UserToolbar class="pl-4"/>
    </div>
  </div>
</template>
