<script lang="tsx" setup>
  import { DescriptionList, Tokens } from '@/components/Ui';
  import { VestingAccount } from '@/domain';

  defineProps<{
    vestingAccount: VestingAccount;
  }>();
</script>

<template>
  <div class="rounded-xl bg-gray-100 px-4 py-6">
    <div class="flex">
      <div class="w-1/3 flex justify-between">
        <DescriptionList label="Vesting Start"> {{ vestingAccount?.formatted.startDate }} </DescriptionList>
        <DescriptionList class="text-right" label="Cliff"> {{ vestingAccount?.formatted.cliffDateDistanceToNow }} </DescriptionList>
      </div>
      <div class="flex-1 flex justify-end space-x-10">
        <DescriptionList class="text-right" label="Total Tokens">
          <div class="text-right">
            <Tokens>{{ vestingAccount?.initialAmount.format() }}</Tokens>
          </div>
        </DescriptionList>
        <DescriptionList class="text-right" label="Vesting End"> {{ vestingAccount?.formatted.endDate }} </DescriptionList>
      </div>
    </div>
    <div class="py-8">
      <div class="flex">
        <div class="w-1/3">
          <div class="h-[2px] bg-gray-warm relative">
            <div class="absolute inset-y-0 left-0 bg-green-700" :style="`width: ${vestingAccount?.progressToCliff}%`" />
          </div>
        </div>
        <div class="flex-1">
          <div class="h-[2px] bg-gray-warm relative">
            <div class="absolute inset-y-0 left-0 bg-green-700" :style="`width: ${vestingAccount?.progressToFullVesting}%`" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <DescriptionList label="Clawback Amount">
        <Tokens>{{ vestingAccount?.clawbackTotalAmount.format() }}</Tokens>
      </DescriptionList>
      <DescriptionList label="Total Withdrawable">
        <Tokens>{{ vestingAccount?.clawbackWithdrableAmount.format() }}</Tokens>
      </DescriptionList>
      <DescriptionList label="Total Withdrawn">
        <Tokens>{{ vestingAccount?.clawbackWithdrawnAmount.format() }}</Tokens>
      </DescriptionList>
    </div>
  </div>
</template>
