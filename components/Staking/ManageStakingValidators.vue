<script lang="ts" setup>
  import { PropType } from 'vue';
  import { PlusIcon } from '@heroicons/vue/24/solid';
  import { PrimaryButton } from '@/components/Ui';
  import ManageStakingValidatorBlock from '@/components/Staking/ManageStakingValidatorBlock.vue';
  import { Validator } from '@/domain';

  import { BulkDelegationBlock } from '@/types';

  const props = defineProps({
    modelValue: { type: Array as PropType<BulkDelegationBlock[]>, default: () => [] },
    validators: { type: Array as PropType<Validator[]>, default: () => [] },
  });
  const emit = defineEmits(['update:modelValue']);

  const blocks = computed<BulkDelegationBlock[] | [{ amount: undefined; validator: undefined }]>(() =>
    props.modelValue.length > 0 ? props.modelValue : [{ amount: undefined, validator: undefined }]
  );

  const add = () => {
    emit('update:modelValue', [...blocks.value, { amount: undefined, validator: undefined }]);
  };

  const update = (index: number, block: BulkDelegationBlock) => {
    const b = [...blocks.value];
    b.splice(index, 1, block);

    emit('update:modelValue', [...b]);
  };

  const remove = (index: number) => {
    const b = [...blocks.value];
    b.splice(index, 1);

    emit('update:modelValue', [...b]);
  };
</script>

<template>
  <template v-for="(block, index) in blocks">
    <ManageStakingValidatorBlock
      :block="block"
      :validators="validators"
      @update:block="(block: BulkDelegationBlock) => update(index, block)"
      @remove:block="() => remove(index)"
    />
  </template>
  <PrimaryButton class="h-9" @click="add">
    <PlusIcon class="w-4 h-4" />
  </PrimaryButton>
</template>
