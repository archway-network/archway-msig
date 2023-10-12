<script lang="tsx" setup>
  import { ref, PropType } from 'vue';
  import { storeToRefs } from 'pinia';

  import { Link, PrimaryButton, TooltipWithIcon, TextareaInput, TokenInput } from '@/components/Ui';
  import ValidatorsSelector from '@/components/Staking/ValidatorsSelector.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useConfig } from '@/composables';
  import { TokenAmount, Validator } from '@/domain/';
  import { useAccountId } from '@/data/useAccountId';
  import { useStakeTokensMutation } from '@/data/useStakeTokensMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { TooltipPosition } from '@/types';

  const props = defineProps({
    validator: { type: Object as PropType<Validator>, required: true },
    validators: { type: Object as PropType<Validator[]>, required: true },
    available: { type: Object as PropType<TokenAmount>, default: undefined },
  });
  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { tokenDenom } = useConfig();

  const { mutate, loading } = await useStakeTokensMutation(accountId.value, walletAddress);

  const selectedValidator = ref(props.validator);
  const amountToStake = ref(TokenAmount.zero(tokenDenom));
  const amountIsValid = ref(false);
  const description = ref();

  const stakeTokens = () => {
    if (!walletAddress.value || !selectedValidator.value) return;

    mutate(
      {
        title: `${amountToStake.value.formatWithCoin()} stake proposal`,
        description: description.value || `Stake ${amountToStake.value.formatWithCoin()} with ${selectedValidator.value.title}`,
        amount: amountToStake.value as TokenAmount,
        validatorAddress: selectedValidator.value.id,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Stake tokens proposal!" />);
          emit('close');
        },
        onError: () => {
          emit('close');
        },
      }
    );
  };

  const maxAvailableAmount = computed(() => props.available || TokenAmount.zero(tokenDenom));
</script>

<template>
  <div class="space-y-6">
    <ValidatorsSelector label="Validator" :validators="validators" v-model="selectedValidator" />
    <TextareaInput label="Proposal description" v-model="description" />
    <TokenInput
      :max-available-amount="maxAvailableAmount"
      v-model="amountToStake"
      v-model:is-valid="amountIsValid"
    />
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="!amountIsValid || (transactionsStore.isInProgress && loading)"
          :loading="transactionsStore.isInProgress && loading"
          @click="stakeTokens"
        >
          Delegate
        </PrimaryButton>
        <TooltipWithIcon
          width="200px"
          text="If you want to unstake your staked tokens, you will need to wait 21 days for your tokens to be available"
          :position="TooltipPosition.TOP_RIGHT"
        />
      </div>
    </div>
  </div>
</template>
