<script lang="ts" setup>
  import { ref } from 'vue';
  import { useQueryClient } from '@tanstack/vue-query';

  import { TextInput } from '@/components/Ui';
  import VestingContractOverviewSkeleton from './VestingContractOverviewSkeleton.vue';
  import VestingContractOverview from './VestingContractOverview.vue';
  import { useArch3, useConfig } from '@/composables';
  import { VestingAccount } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';

  const emit = defineEmits(['select']);

  const { tokenDenom } = useConfig();
  const { accountId } = useAccountId();
  const queryClient = useQueryClient();

  const vestingContractAddress = ref('');
  const vestingAccount = ref<VestingAccount>();
  const loading = ref(false);

  const fetchVestingContract = async () => {
    try {
      loading.value = true;
      vestingAccount.value = await queryClient.fetchQuery({
        queryKey: [{ scope: 'vestingAccounts', entity: `account.${vestingContractAddress.value}.status` }],
        queryFn: async () => {
          const { client } = await useArch3();
          return client
            .queryContractSmart(vestingContractAddress.value, { status: {} })
            .then(data => VestingAccount.make(accountId.value, vestingContractAddress.value, data, tokenDenom));
        },
      });
      emit('select', vestingAccount.value);
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="space-y-6">
    <TextInput label="Vesting contract address" v-model="vestingContractAddress" @blur="fetchVestingContract" />
    <VestingContractOverviewSkeleton v-if="loading" />
    <VestingContractOverview :key="vestingAccount.id" :vesting-account="vestingAccount" v-else-if="vestingAccount" />
  </div>
</template>
