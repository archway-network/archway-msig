<script lang="ts" setup>
  import { PropType } from 'vue';
  import { PlusIcon } from '@heroicons/vue/24/solid';

  import { PrimaryButton, Label } from '@/components/Ui';
  import ParameterChange from '@/components/Proposals/GovernanceProposals/ParameterChange.vue';

  import { ChainParameter } from '@/types';

  const props = defineProps({
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    modelValue: { type: Array as PropType<ChainParameter[]>, default: () => [] },
  });
  const emit = defineEmits(['update:modelValue']);

  const chainParameters = computed<ChainParameter[] | [{ subspace: undefined; key: undefined, value:undefined }]>(() =>
    props.modelValue.length > 0 ? props.modelValue : [{ subspace: undefined, key: undefined, value:undefined }]
  );

  const add = () => {
    emit('update:modelValue', [...chainParameters.value, {subspace: undefined, key: undefined, value:undefined }]);
  };

  const update = (index: number, parameter: ChainParameter) => {
    const b = [...chainParameters.value];
    b.splice(index, 1, parameter);

    emit('update:modelValue', [...b]);
  };

  const remove = (index: number) => {
    const b = [...chainParameters.value];
    b.splice(index, 1);

    emit('update:modelValue', [...b]);
  };
</script>

<template>
  <div>
    <Label :label="label" :required="required" />
    <div class="space-y-6">
      <template v-for="(chainParameter, index) in chainParameters">
        <ParameterChange
          :chainParameter="chainParameter"
          @update:chainParameter="chainParameter => update(index, chainParameter)"
          @remove:chainParameter="() => remove(index)"
        />
      </template>
      <PrimaryButton class="h-9" @click="add">
        <PlusIcon class="w-4 h-4" />
      </PrimaryButton>
    </div>
  </div>
</template>
