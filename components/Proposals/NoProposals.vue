<script lang="ts" setup>
  import { useConfig } from '@/composables';

  const config = useConfig();
</script>

<template>
  <div class="bg-white bg-opacity-60 rounded-2xl flex flex-row w-full">
    <img class="w-[250px] xl:w-[445px]" src="@/assets/images/illustration-1.png" alt="" />
    <div class="flex flex-col justify-center align-middle">
      <div class="space-y-2 pl-10">
        <div class="title-3">Create your own proposal</div>
        <div class="pb-4">
          Looks like there are no proposals matching your selection <br />
          Have you considered submitting one of your ideas?
        </div>
        <div class="pb-4 text-orange">You can press the button to the top-right of this page to create a new proposal</div>
      </div>
    </div>
  </div>
</template>
