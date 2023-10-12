<script lang="tsx" setup>
  import { ref, PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import _ from 'lodash';

  import { Link, PrimaryButton, TextareaInput, TooltipWithIcon, TokenInput } from '@/components/Ui';
  import ValidatorsSelector from '@/components/Staking/ValidatorsSelector.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useConfig } from '@/composables';
  import { TokenAmount, Validator, ValidatorDelegation } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useUnstakeTokensMutation } from '@/data/useUnstakeTokensMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { TooltipPosition } from '@/types';

  const props = defineProps({
    validator: { type: Object as PropType<Validator>, required: true },
    delegates: { type: Object as PropType<Validator[]>, required: true },
    delegations: { type: Array as PropType<ValidatorDelegation[]>, optional: true },
  });
  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { tokenDenom } = useConfig();

  const { mutate, loading } = await useUnstakeTokensMutation(accountId.value, walletAddress);

  const selectedValidator = ref(props.validator);
  const amountToUnstake = ref(TokenAmount.zero(tokenDenom));
  const amountIsValid = ref(false);
  const description = ref();

  const unstakeTokens = () => {
    if (!walletAddress.value || !selectedValidator.value) return;

    mutate(
      {
        title: `${amountToUnstake.value.formatWithCoin()} unstake proposal`,
        description: description.value || `Unstake ${amountToUnstake.value.formatWithCoin()} from ${selectedValidator.value.title}`,
        amount: amountToUnstake.value as TokenAmount,
        validatorAddress: selectedValidator.value.id,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Unstake tokens proposal!" />);
          emit('close');
        },
        onError: () => {
          emit('close');
        },
      }
    );
  };

  const delegationsByValidator = computed(() => _.keyBy(props.delegations, 'validator'));
  const maxAvailableAmount = computed(
    () => delegationsByValidator.value?.[selectedValidator.value?.id]?.amount || TokenAmount.zero(tokenDenom)
  );
</script>

<template>
  <div class="space-y-6">
    <ValidatorsSelector label="Validator" :validators="delegates" v-model="selectedValidator" />
    <TextareaInput label="Proposal description" v-model="description" />
    <TokenInput :max-available-amount="maxAvailableAmount" v-model="amountToUnstake" v-model:is-valid="amountIsValid" />
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="!amountIsValid || (transactionsStore.isInProgress && loading)"
          :loading="transactionsStore.isInProgress && loading"
          @click="unstakeTokens"
        >
          Unstake
        </PrimaryButton>
        <TooltipWithIcon
          width="200px"
          text="f you want to unstake your staked tokens, you will need to wait 21 days for your tokens to be available."
          :position="TooltipPosition.TOP_RIGHT"
        />
      </div>
    </div>
  </div>
</template>
