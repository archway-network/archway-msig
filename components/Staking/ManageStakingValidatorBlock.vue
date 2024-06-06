<script lang="ts" setup>
  import { type PropType } from 'vue';
  import BigNumber from 'bignumber.js';
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { TextInput } from '@/components/Ui';
  import ValidatorsSelector from '@/components/Staking/ValidatorsSelector.vue';
  import { useConfig } from '@/composables';
  import { TokenAmount, Validator } from '@/domain';

  import { type BulkDelegationBlock } from '@/types';

  const props = defineProps({
    block: { type: Object as PropType<BulkDelegationBlock>, required: true },
    validators: { type: Array as PropType<Validator[]>, default: () => [] },
  });
  const emit = defineEmits(['update:block', 'remove:block']);

  const { tokenDenom } = useConfig();

  const sanitizeAmount = (a: any) => a.replace(/[^\d.]/g, '');

  const updateBlock = (attributes: { amount?: number; validator?: Validator }) => {
    const block = Object.assign(
      {},
      props.block,
      attributes.amount ? { amount: TokenAmount.makeFromDenom(sanitizeAmount(attributes.amount), tokenDenom) } : {},
      attributes.validator ? { validator: attributes.validator } : {}
    );

    emit('update:block', block as BulkDelegationBlock);
  };

  const removeBlock = () => {
    emit('remove:block');
  };
</script>

<template>
  <div class="bg-gray-warm rounded-lg px-4 py-4 relative">
    <button class="absolute top-2 right-4" @click="removeBlock">
      <XCircleIcon class="w-6 h-6 text-gray-800" />
    </button>
    <div class="flex items-center space-x-4">
      <div class="w-30">
        <TextInput
          class="text-center"
          label="Amount"
          :model-value="block.amount?.format()"
          @update:model-value="v => updateBlock({ amount: v as unknown as number })"
        />
      </div>
      <div class="flex-1">
        <ValidatorsSelector
          class="bg-white"
          label="Validator"
          :validators="validators"
          :model-value="block.validator"
          @update:model-value="v => updateBlock({ validator: v })"
        />
      </div>
    </div>
  </div>
</template>
