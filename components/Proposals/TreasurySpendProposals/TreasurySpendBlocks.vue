<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { PlusIcon } from '@heroicons/vue/24/solid';

  import { PrimaryButton, Label } from '@/components/Ui';
  import TreasurySpendBlock from '@/components/Proposals/TreasurySpendProposals/TreasurySpendBlock.vue';

  import { type TreasurySpendBlock as TreasurySpendBlockType } from '@/types';

  const props = defineProps({
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    modelValue: { type: Array as PropType<TreasurySpendBlockType[]>, default: () => [] },
  });

  const emit = defineEmits(['update:modelValue']);

  const blocks = computed<TreasurySpendBlockType[] | [{ amount: undefined; address: undefined }]>(() =>
    props.modelValue.length > 0 ? props.modelValue : [{ amount: undefined, address: undefined }]
  );

  const add = () => {
    emit('update:modelValue', [...blocks.value, { amount: undefined, address: undefined }]);
  };

  const update = (index: number, block: TreasurySpendBlockType) => {
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
  <div>
    <Label :label="label" :required="required" />
    <div class="space-y-6">
      <template v-for="(block, index) in blocks">
        <TreasurySpendBlock :block="block" @update:block="block => update(index, block)" @remove:block="() => remove(index)" />
      </template>
      <PrimaryButton class="h-9" @click="add">
        <PlusIcon class="w-4 h-4" />
      </PrimaryButton>
    </div>
  </div>
</template>
