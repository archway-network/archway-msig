<script setup>
  import { LogoAndBrand } from '@/components/Ui';
  import { useConfig } from '@/composables';

  const { name } = useConfig();
</script>

<template>
  <main class="flex-1 lg:hidden flex flex-col py-6">
    <div class="flex justify-center">
      <span class="flex items-center flex-shrink-0">
        <LogoAndBrand />
      </span>
    </div>
    <div class="flex-1 flex flex-col px-4 py-6">
      <div class="flex-1 w-full bg-black rounded-2xl mx-auto flex items-end p-6 sm:p-12">
        <div class="space-y-6">
          <h1 class="heading-2 text-white uppercase max-w-xl">
            Access the {{ name }} <span class="font-offbit">Multisig</span> on your desktop device
          </h1>
          <h2 class="text-white">Soon you’ll be able to access the {{ name }} Multisig on your mobile.</h2>
        </div>
      </div>
    </div>
  </main>
</template>
