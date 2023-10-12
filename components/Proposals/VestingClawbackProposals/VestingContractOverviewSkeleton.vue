<script lang="tsx" setup>
  import { DescriptionList, LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="rounded-xl bg-gray-100 px-4 py-6">
    <div class="flex">
      <DescriptionList class="w-1/3" label="Vesting Start"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      <DescriptionList class="text-right" label="Cliff"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      <div class="flex-1 flex justify-end space-x-10">
        <DescriptionList class="text-right" label="Total Tokens"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
        <DescriptionList class="text-right" label="Vesting End"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      </div>
    </div>
    <div class="py-8">
      <LoadingPulse class="w-full h-[2px]" />
    </div>
    <div class="flex justify-between">
      <DescriptionList label="Clawback Amount"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      <DescriptionList label="Total Withdrawable"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      <DescriptionList label="Total Withdrawn"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
    </div>
  </div>
</template>
