<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { XCircleIcon } from '@heroicons/vue/24/outline';

  import { TextInput } from '@/components/Ui';
  import { TokenAmount } from '@/domain';
  import { useConfig } from '@/composables';

  import { type TreasurySpendBlock } from '@/types';

  const props = defineProps({
    block: { type: Object as PropType<TreasurySpendBlock | { amount: undefined; address: undefined }>, required: true },
  });
  const emit = defineEmits(['update:block', 'remove:block']);

  const { tokenDenom } = useConfig();

  const sanitizeAmount = (a: any) => a.replace(/[^\d.]/g, '');

  const updateBlock = (attributes: { amount?: number; address?: string }) => {
    const block = Object.assign(
      {},
      props.block,
      attributes.amount ? { amount: TokenAmount.makeFromDenom(sanitizeAmount(attributes.amount), tokenDenom) } : {},
      attributes.address ? { address: attributes.address } : {}
    );

    emit('update:block', block);
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
          label="Token Amount"
          :model-value="block.amount?.format()"
          @update:model-value="v => updateBlock({ amount: v as unknown as number })"
        />
      </div>
      <div class="flex-1">
        <TextInput
          label="Address"
          placeholder="enter an address..."
          :model-value="block?.address"
          @update:model-value="v => updateBlock({ address: v })"
        />
      </div>
    </div>
  </div>
</template>
