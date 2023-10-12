<script lang="ts" setup>
  import UserWelcomeCard from '@/components/Accounts/WelcomeCard.vue';
  import Accounts from '@/components/Accounts/Accounts.vue';

  definePageMeta({
    layout: false,
  });
</script>

<template>
  <NuxtLayout name="home">
    <main>
      <div class="pb-8">
        <UserWelcomeCard />
      </div>
      <Accounts />
    </main>
  </NuxtLayout>
</template>
