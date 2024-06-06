<script lang="ts" setup>
  import AccountSelector from '@/components/Accounts/AccountSelector.vue';
  import { Brand, Link, Logo, MenuCollapseIcon, MenuIcon, Tooltip } from '@/components/Ui';
  import { useNavigation } from '@/composables';
  import { Navigation } from '@/domain';

  import { type AccountConfig, TooltipPosition } from '@/types';

  const { expanded, toggle, setCurrentNavigation } = useNavigation();
  const route = useRoute();

  const navigation = computed(() => Navigation.items(route.params.accountId as AccountConfig.AccountId));
</script>

<template>
  <div
    :class="[
      'transition-width duration-700 bg-white rounded-lg flex justify-left py-8 transform z-20',
      expanded ? 'w-[200px]' : 'w-[80px]',
    ]"
  >
    <div class="flex flex-col px-4 space-y-6">
      <div class="px-4">
        <button @click="toggle">
          <MenuCollapseIcon class="w-4 h-4" v-show="expanded" />
          <MenuIcon class="w-4 h-4" v-show="!expanded" />
        </button>
      </div>
      <div :class="['px-3 py-3', expanded ? 'pr-0' : '']">
        <NuxtLink href="/" class="flex items-center flex-shrink-0">
          <Logo />
          <div
            :class="[
              'flex items-center overflow-x-hidden transition-all duration-700',
              expanded ? 'w-full opacity-100 overflow-x-visible' : 'w-0 opacity-0',
            ]"
          >
            <Brand class="pl-2 overflow-visible" />
          </div>
        </NuxtLink>
      </div>
      <AccountSelector :expanded="expanded" />
      <div class="grid grid-cols-1">
        <div :key="`navigation-${label}`" v-for="{ label, url, icon } in navigation">
          <Tooltip :text="label" :position="TooltipPosition.RIGHT" :disabled="expanded">
            <Link class="!text-gray" active-class="!text-black" :href="url" @click="setCurrentNavigation(label)">
              <span class="flex items-center">
                <component :is="icon" class="flex-shrink-0 w-5 h-5 mx-4 my-4" aria-hidden="true" />
                <div :class="['caption overflow-x-hidden transition-all duration-700', expanded ? 'w-full opacity-100' : 'w-0 opacity-0']">
                  {{ label }}
                </div>
              </span>
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
