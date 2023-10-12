<script setup>
  import { LoadingIcon } from '@/components/Ui';
  import BaseLayout from '@/components/BaseLayout.vue';
  import Header from '@/components/Header.vue';
  import Navigation from '@/components/Navigation.vue';
</script>

<template>
  <BaseLayout v-slot="{ isAuthLoading }">
    <div class="flex-1 flex space-x-16">
      <aside class="h-screen sticky top-0 z-50">
        <Navigation class="flex-shrink-0 ml-2 my-2 h-[calc(100vh-1rem)]" />
      </aside>
      <div class="flex-1 bg-gray-warm pr-8 flex justify-center items-center" v-if="isAuthLoading !== false">
        <LoadingIcon class="w-10 h-10 text-gray-900 animate-spin" />
      </div>
      <div class="flex-1 bg-gray-warm pr-8" v-else>
        <Header class="border-b" />
        <div class="pt-8 pb-16">
          <slot def />
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
