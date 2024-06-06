<script lang="tsx" setup>
  import { ref, type PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import _ from 'lodash';

  import { Link, PrimaryButton, TextareaInput, TokenInput } from '@/components/Ui';
  import ValidatorsSelector from '@/components/Staking/ValidatorsSelector.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useConfig } from '@/composables';
  import { TokenAmount, Validator, ValidatorDelegation } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useRedelegateTokensMutation } from '@/data/useRedelegateTokensMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const props = defineProps({
    validator: { type: Object as PropType<Validator>, required: true },
    delegates: { type: Object as PropType<Validator[]>, required: true },
    validators: { type: Object as PropType<Validator[]>, required: true },
    delegations: { type: Array as PropType<ValidatorDelegation[]>, optional: true },
  });
  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { tokenDenom } = useConfig();

  const { mutate, loading } = await useRedelegateTokensMutation(accountId.value, walletAddress);

  const selectedFromValidator = ref(props.validator);
  const selectedToValidator = ref();
  const amountToRedelegate = ref(TokenAmount.zero(tokenDenom));
  const amountIsValid = ref(false);
  const description = ref();

  const redelegateTokens = () => {
    if (!walletAddress.value || !selectedFromValidator.value || !selectedToValidator.value) return;

    mutate(
      {
        title: `${amountToRedelegate.value.formatWithCoin()} redelegate proposal`,
        description:
          description.value ||
          `Redelegate ${amountToRedelegate.value.formatWithCoin()} from ${selectedFromValidator.value.title} to ${
            selectedToValidator.value.title
          }`,
        amount: amountToRedelegate.value as TokenAmount,
        fromValidatorAddress: selectedFromValidator.value.id,
        toValidatorAddress: selectedToValidator.value.id,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Redelegate tokens proposal!" />);
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
    () => delegationsByValidator.value?.[selectedFromValidator.value?.id]?.amount || TokenAmount.zero(tokenDenom)
  );
</script>

<template>
  <div class="space-y-6">
    <ValidatorsSelector label="From" :validators="delegates" v-model="selectedFromValidator" />
    <ValidatorsSelector label="To" :validators="validators" v-model="selectedToValidator" />
    <TextareaInput label="Proposal description" v-model="description" />
    <TokenInput :max-available-amount="maxAvailableAmount" v-model="amountToRedelegate" v-model:is-valid="amountIsValid" />
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="!amountIsValid || (transactionsStore.isInProgress && loading)"
          :loading="transactionsStore.isInProgress && loading"
          @click="redelegateTokens"
        >
          Redelegate
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
