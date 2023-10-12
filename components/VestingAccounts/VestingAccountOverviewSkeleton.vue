<script lang="ts" setup>
  import { DescriptionList, LoadingPulse } from '@/components/Ui';
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <div>
      <div class="flex justify-between items-center">
        <DescriptionList label="Vesting Start"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
        <DescriptionList class="text-right" label="Cliff"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      </div>
      <div class="py-6">
        <LoadingPulse class="w-full h-[2px]" />
      </div>
      <DescriptionList label="Amount unlocked at cliff">
        <LoadingPulse class="rounded-2xl w-32 h-10" />
      </DescriptionList>
    </div>
    <div class="col-span-2">
      <div class="flex justify-end items-center space-x-6">
        <DescriptionList class="text-right" label="Total Tokens">
          <LoadingPulse class="rounded-2xl w-32 h-6" />
        </DescriptionList>
        <DescriptionList class="text-right" label="Vesting End"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
      </div>
      <div class="py-6">
        <LoadingPulse class="w-full h-[2px]" />
      </div>
      <div class="flex gap-12 pb-4">
        <div class="flex-1">
          <DescriptionList label="Unlocked Tokens">
            <LoadingPulse class="rounded-2xl w-32 h-10" />
          </DescriptionList>
          <div class="pt-4 space-y-1">
            <DescriptionList class="flex items-center justify-between" label="Withdrawable">
              <LoadingPulse class="rounded-2xl w-32 h-6" />
            </DescriptionList>
            <DescriptionList class="flex items-center justify-between" label="Withdrawn">
              <LoadingPulse class="rounded-2xl w-32 h-6" />
            </DescriptionList>
          </div>
        </div>
        <div class="flex-1">
          <div class="divide-y divide-gray-warm">
            <div class="flex justify-between pb-4">
              <DescriptionList class="flex-1" label="Total Staked"> <LoadingPulse class="rounded-2xl w-32 h-6" /> </DescriptionList>
              <DescriptionList label="Unbonding">
                <LoadingPulse class="rounded-2xl w-32 h-6" />
              </DescriptionList>
            </div>
            <div class="pt-4 space-y-1">
              <DescriptionList class="flex items-center justify-between" label="Unclaimed Staking Rewards">
                <LoadingPulse class="rounded-2xl w-32 h-6" />
              </DescriptionList>
              <DescriptionList class="flex items-center justify-between" label="Withdrawable Rewards">
                <LoadingPulse class="rounded-2xl w-32 h-6" />
              </DescriptionList>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 pt-4 mt-4 border-t border-gray-warm">
        <div class="flex justify-between">
          <div>
            <LoadingPulse class="rounded-2xl w-40 h-12" />
          </div>
          <div class="flex space-x-4">
            <LoadingPulse class="rounded-2xl w-40 h-12" />
            <LoadingPulse class="rounded-2xl w-40 h-12" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
