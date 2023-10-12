<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';

  import { CopyAddress, LoadingPulse, AdminIcon, UsersIcon, ArchwayToken } from '@/components/Ui';
  import { useAuthStore } from '@/store';
  import { Member } from '@/domain';
  import { useAccount } from '@/data/useAccount';
  import { useWalletBalance } from '@/data/useWalletBalance';

  const props = defineProps({
    accountId: { type: String, required: true },
    compact: {type: Boolean, default: false}
  });

  const { walletAddress } = storeToRefs(useAuthStore());
  const { account, members, totalProposals, loading: loadingAccount } = await useAccount(props.accountId, walletAddress);
  const { available, loading: loadingBalance } = await useWalletBalance(props.accountId, walletAddress);

  const totalMembers = computed(() => (members.value || []).length);

  const AccountTitle = () => {
    if (loadingAccount.value) return <LoadingPulse class="inline-block w-[160px] h-8 rounded-md" />;
    return <span class="font-offbit">{account.value?.title}</span>;
  };

  const TotalMembers = () => {
    if (loadingAccount.value) return <LoadingPulse class="inline-block w-[20px] h-4 rounded-md" />;
    return <span class="caption">{totalMembers.value}</span>;
  };

  const TotalProposals = () => {
    if (loadingAccount.value) return <LoadingPulse class="inline-block w-[20px] h-4 rounded-md" />;
    return <span class="caption">{totalProposals.value}</span>;
  };

  const TotalTreasury = () => {
    if (loadingBalance.value) return <LoadingPulse class="inline-block w-[80px] h-4 rounded-md" />;
    return <span class="caption">{props.compact ? available.value?.format(2) : available.value?.formatWithCoin(4)}</span>;
  };

  const canBeAccessed = computed(() => members.value?.some((member: Member) => member.addr === walletAddress.value));
</script>

<template>
  <div v-if="canBeAccessed" class="flex flex-col">
    <div class="text-lg leading-tight"><AccountTitle /></div>
    <CopyAddress v-if="compact" class="caption text-gray" :address="accountId" />
    <div class="h-[1.5rem] flex items-center space-x-4">
      <span class="flex items-center space-x-2">
        <UsersIcon class="w-4 h-4" />
        <TotalMembers />
      </span>
      <span class="flex items-center space-x-2">
        <AdminIcon class="w-4 h-4" />
        <TotalProposals />
      </span>
      <span class="flex items-center space-x-2">
        <ArchwayToken class="w-4 h-4" />
        <TotalTreasury />
      </span>
    </div>
  </div>
</template>
