<script lang="tsx" setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

  import AccountCard from './AccountCard.vue';
  import CurrentAccount from './CurrentAccount.vue';
  import { ChevronDownIcon, LoadingPulse } from '@/components/Ui';
  import { useAccounts } from '@/data/useAccounts';
  import { useAccountId } from '@/data/useAccountId';

  const props = defineProps({
    expanded: { type: Boolean, required: true },
  });

  const { accounts } = useAccounts();
  const { accountId } = useAccountId();
</script>

<template>
  <div class="">
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton
        class="flex flex-col items-center divide-y focus:outline-none border text-black/60 border-gray-warm rounded-lg p-4"
        :class="{ '!flex-row divide-y-0': expanded, 'bg-gray-warm': open }"
      >
        <CurrentAccount v-if="accountId" :class="[!expanded && 'mb-4']" :compact="!expanded" />
        <LoadingPulse v-else class="w-5 h-5" :class="[!expanded && 'mb-4']" />
        <div :class="[expanded ? 'pl-4' : 'pt-4']">
          <ChevronDownIcon :class="open ? 'rotate-180' : ''" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        </div>
      </PopoverButton>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute bg-white border border-gray-warm rounded-2xl z-50 max-w-sm lg:max-w-3xl transform px-4 pt-2 pb-4 shadow-card">
          <NuxtLink v-for="(accountId, index) in accounts" :key="index" class="" :href="`/accounts/${accountId}/proposals`">
            <AccountCard class="border border-gray-warm rounded-lg p-4 mt-2" :accountId="accountId" compact />
          </NuxtLink>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>
