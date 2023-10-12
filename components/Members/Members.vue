<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import MembersSkeleton from '@/components/Members/MembersSkeleton.vue';
  import ManageMembersButton from '@/components/Members/ManageMembersButton.vue';
  import MembersList from '@/components/Members/MembersList.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useMembers } from '@/data/useMembers';
  import { useAuthStore } from '@/store';

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { members, loading } = await useMembers(accountId.value, walletAddress);
</script>

<template>
  <div class="flex justify-end pb-6">
    <ManageMembersButton />
  </div>
  <div class="bg-white rounded-2xl px-8 py-8 space-y-6">
    <MembersSkeleton v-if="loading" />
    <template v-else>
      <MembersList :members="members" v-if="members && members.length > 0" />
    </template>
  </div>
</template>
