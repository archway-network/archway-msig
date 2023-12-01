<script lang="ts" setup>
  import { PropType, ref } from 'vue';
  import BigNumber from 'bignumber.js';

  import Label from './Label.vue';
  import LoadingPulse from '@/components/Ui/Misc/LoadingPulse.vue';
  import Tokens from '@/components/Ui/Tokens.vue';
  import SecondaryButton from '@/components/Ui/Buttons/SecondaryButton.vue';
  import TextInput from '@/components/Ui/Forms/DefaultTextInput.vue';
  import { TokenAmount } from '@/domain';

  import { TokenDenom } from '@/types';

  const props = defineProps({
    label: { type: String, default: undefined },
    modelValue: { type: Object as PropType<TokenAmount>, required: true },
    maxAvailableAmount: { type: Object as PropType<TokenAmount> },
    estimatedFee: { type: Object as PropType<TokenAmount> },
    hideMaxAmount: { type: Boolean, default: false },
    tokenDenom: { type: Object as PropType<TokenDenom> },
    required: { type: Boolean, default: true },
    isValid: { type: Boolean, default: true },
  });

  const emit = defineEmits(['update:modelValue', 'update:isValid']);

  const inputValue = ref<string>(props.modelValue.amount.isZero() ? '' : props.modelValue.format());
  const error = ref<string | undefined>(undefined);

  const maxAmount = computed(() => {
    if (!props.maxAvailableAmount) return TokenAmount.zero(props.modelValue.denom);

    if (props.estimatedFee) {
      const minusFee = props.maxAvailableAmount.minus(props.estimatedFee);

      return minusFee.amount.isNegative() ? TokenAmount.zero(props.modelValue.denom) : minusFee;
    }

    return props.maxAvailableAmount;
  });

  const setMaxAmount = () => {
    onAmountUpdate(maxAmount.value.format());
  };

  const onAmountUpdate = (value: string) => {
    let isValid = true;
    error.value = undefined;

    let cleanedValue = value
      .replace(/[^\d.-]/g, '') // Remove non-numeric characters except dots and dashes
      .replace(/^0+/, ''); // Remove zeroes at start

    if (cleanedValue.startsWith('.')) cleanedValue = '0' + cleanedValue; // Add back one zero for decimals

    const converted = BigNumber(cleanedValue || 0);

    if (props.required && converted.isZero()) isValid = false;

    if (converted.isNaN()) {
      isValid = false;
      error.value = 'Amount entered is not a number.';
    }

    const tokenAmount = TokenAmount.makeFromDenom(converted, props.modelValue.denom);

    if (!props.hideMaxAmount && tokenAmount.amount.isGreaterThan(maxAmount.value.amount)) {
      isValid = false;
      error.value = `Amount entered is greater than available balance${props.estimatedFee ? ' minus transaction fees' : ''}.`;
    }

    inputValue.value = cleanedValue;
    emit('update:modelValue', tokenAmount);
    emit('update:isValid', isValid);
  };
</script>

<template>
  <div class="space-y-3">
    <Label :label="label" :required="required" />
    <div class="bg-gray-warm rounded-lg px-6 py-6 divide-y-[.5px] divide-gray-400">
      <div class="flex justify-between items-center" :class="{ 'pb-2': !hideMaxAmount }">
        <Tokens :icon="tokenDenom?.coinImageUrl" before class="mr-4 flex-shrink-0">
          <span class="font-bold text-gray-800">{{ tokenDenom?.coinDenom || 'ARCH' }}</span>
        </Tokens>
        <div class="flex flex-col flex-1 items-stretch">
          <TextInput
            class="bg-transparent !text-black placeholder:text-gray-800 !title-1 text-end !w-full !px-0 focus:border-none"
            placeholder="0"
            :model-value="inputValue"
            :errors="error"
            @update:model-value="onAmountUpdate"
          />
        </div>
      </div>
      <div class="flex justify-between items-center pt-2" v-if="!hideMaxAmount">
        <div class="flex flex-row small text-gray-800 space-x-1">
          <div>Balance:</div>
          <div v-if="maxAvailableAmount">{{ maxAvailableAmount.formatWithCoin() }}</div>
          <LoadingPulse v-else class="w-12 h-4" />
        </div>
        <SecondaryButton :disabled="!maxAvailableAmount" @click="setMaxAmount">Max</SecondaryButton>
      </div>
    </div>
  </div>
</template>
