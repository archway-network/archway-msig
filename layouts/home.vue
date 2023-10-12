<script setup>
  import { LoadingIcon, LogoAndBrand } from '@/components/Ui';
  import BaseLayout from '@/components/BaseLayout.vue';
  import Header from '@/components/Header.vue';
</script>

<template>
  <BaseLayout v-slot="{ isAuthLoading }">
    <div class="flex-1 bg-gray-warm pr-8 flex justify-center items-center" v-if="isAuthLoading !== false">
      <LoadingIcon class="w-10 h-10 text-gray-900 animate-spin" />
    </div>
    <div class="flex-1 flex flex-col bg-gray-warm px-4 md:px-6 lg:px-8" v-else>
      <div class="flex items-center">
        <div class="flex-1">
          <span class="flex items-center flex-shrink-0">
            <LogoAndBrand />
          </span>
        </div>
        <Header />
      </div>
      <div class="flex-1 flex flex-col pt-4 pb-8">
        <slot />
      </div>
    </div>
  </BaseLayout>
</template>
