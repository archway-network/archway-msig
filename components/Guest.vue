<script setup>
  import { LoadingIcon, LogoAndBrand } from '@/components/Ui';
  import Header from '@/components/Header.vue';
  import { useConfig } from '@/composables';
  import { useAuthStore } from '@/store';

  const { appName } = useConfig();

  const auth = useAuthStore();
</script>

<template>
  <div class="flex-1 w-full mr-auto ml-auto max-w-[1920px] bg-gray-warm flex-col">
    <div class="flex-1 bg-gray-warm pr-8 flex justify-center items-center" v-if="auth.loading !== false">
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
        <main class="flex-1 flex flex-col">
          <div class="flex-1 flex flex-col justify-end bg-black rounded-2xl px-8 py-16 relative">
            <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img src="@/assets/images/hero.png" class="max-w-6xl object-contain" />
            </div>
            <h1 class="title-1 text-white uppercase relative z-20">
              Welcome to <br />
              {{ appName }} <span class="font-offbit">MultiSig Portal</span>.
            </h1>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
