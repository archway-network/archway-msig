<script lang="ts" setup>
  import { ref, type PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { DefaultModal, FiltersInput, LoadingIcon } from '@/components/Ui';
  import StakeTokens from '@/components/Staking/StakeTokens.vue';
  import UnstakeTokens from '@/components/Staking/UnstakeTokens.vue';
  import RedelegateTokens from '@/components/Staking/RedelegateTokens.vue';
  import { Validator } from '@/domain/';
  import { useAuthStore } from '@/store';
  import { useAccountId } from '@/data/useAccountId';
  import { useWalletBalance } from '@/data/useWalletBalance';
  import { useStakingValidators } from '@/data/useStakingValidators';
  import { useValidatorsWithMyDelegations } from '@/data/useValidatorsWithMyDelegations';
  import { useValidatorsDelegations } from '@/data/useValidatorsDelegations';

  enum Actions {
    Stake = 'Stake',
    Unstake = 'Unstake',
    Redelegate = 'Redelegate',
  }

  defineProps({
    isOpen: { type: Boolean, default: false },
    validator: { type: Object as PropType<Validator>, required: true },
  });
  const emit = defineEmits(['close']);

  const actions = ref<{ id: string; label: string }[]>([
    { id: Actions.Stake, label: Actions.Stake },
    { id: Actions.Unstake, label: Actions.Unstake },
    { id: Actions.Redelegate, label: Actions.Redelegate },
  ]);

  const selectedAction = ref(Actions.Stake);

  const { isAuthenticated, walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { available, loading: isLoadingAvailableBalance } = await useWalletBalance(accountId.value, walletAddress);

  const { validators: stakingValidators, loading: isLoadingStakingValidators } = await useStakingValidators();
  const { validators: delegates, loading: isLoadingDelegates } = await useValidatorsWithMyDelegations(accountId);
  const { delegations, loading: isLoadingDelegations } = await useValidatorsDelegations(accountId, isAuthenticated);

  const loading = computed(
    () => isLoadingAvailableBalance.value || isLoadingStakingValidators.value || isLoadingDelegates.value || isLoadingDelegations.value
  );
</script>

<template>
  <DefaultModal :is-open="isOpen" @close="emit('close')" :height-ratio="2.75">
    <div class="flex flex-col text-left px-12 py-12">
      <div class="space-y-8">
        <h2 class="title-5">Manage Tokens</h2>
        <div class="w-fit">
          <FiltersInput :filters="actions" :default-value="Actions.Stake" v-model="selectedAction" />
        </div>
        <div class="flex items-center justify-center min-h-[100px]" v-if="loading">
          <LoadingIcon class="w-10 h-10 text-orange animate-spin" />
        </div>
        <template v-else>
          <StakeTokens
            :validators="stakingValidators"
            :validator="validator"
            :available="available"
            @close="emit('close')"
            v-if="stakingValidators && selectedAction === Actions.Stake"
          />
          <UnstakeTokens
            :delegates="delegates"
            :delegations="delegations"
            :validator="validator"
            @close="emit('close')"
            v-if="delegates && selectedAction === Actions.Unstake"
          />
          <RedelegateTokens
            :delegates="delegates"
            :validators="stakingValidators"
            :delegations="delegations"
            :validator="validator"
            @close="emit('close')"
            v-if="stakingValidators && delegates && selectedAction === Actions.Redelegate"
          />
        </template>
      </div>
    </div>
  </DefaultModal>
</template>
