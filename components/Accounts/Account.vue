<script lang="tsx" setup>
  import { computed, type PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { CopyAddress } from '@/components/Ui';
  import AccountSkeleton from '@/components/Accounts/AccountSkeleton.vue';
  import AccountsIllustrations from '@/components/Accounts/AccountsIllustrations.vue';
  import { Member } from '@/domain';
  import { useAccount } from '@/data/useAccount';
  import { useAuthStore } from '@/store';

  import type { AccountConfig } from '@/types';

  const props = defineProps({
    accountId: { type: String as PropType<AccountConfig.AccountId>, required: true },
    accountIndex: { type: Number, required: true },
  });

  const { walletAddress } = storeToRefs(useAuthStore());

  const { account, members, totalProposals, loading } = await useAccount(props.accountId, walletAddress);
  const totalMembers = computed(() => (members.value || []).length);
  const canBeAccessed = computed(() => members.value?.some((member: Member) => member.addr === walletAddress.value));
</script>

<template>
  <NuxtLink class="w-1/3 2xl:w-1/4 bg-white rounded-2xl flex flex-col" :href="`/accounts/${accountId}/proposals`" v-if="canBeAccessed">
    <AccountsIllustrations class="px-6 lg:px-8 pt-6 lg:pt-8" :account-index="accountIndex" />
    <AccountSkeleton v-if="loading" />
    <div class="flex-1 flex flex-col px-6 lg:px-8 pt-6 pb-6 lg:pb-8" v-else>
      <h3 class="title-5 truncate">{{ account?.title }}</h3>
      <div>
        <CopyAddress class="caption text-gray" :address="account?.id" />
      </div>
      <div class="flex items-center justify-between pt-6">
        <dl class="flex items-center space-x-2">
          <dt>{{ totalMembers }}</dt>
          <dd>members</dd>
        </dl>
        <dl class="flex items-center space-x-2">
          <dt>{{ totalProposals || 0 }}</dt>
          <dd>proposals</dd>
        </dl>
      </div>
    </div>
  </NuxtLink>
</template>
