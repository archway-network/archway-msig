<script lang="ts" setup>
  import { PropType } from 'vue';

  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { TextInput } from '@/components/Ui';

  import { ChainParameter } from '@/types';

  const props = defineProps({
    chainParameter: {
      type: Object as PropType<ChainParameter | { subspace: undefined; key: undefined; value: undefined }>,
      required: true,
    },
  });
  const emit = defineEmits(['update:chainParameter', 'remove:chainParameter']);

  const updateChainParameter = (attributes: { subspace?: string; key?: string; value?: string }) => {
    const chainParameter = Object.assign(
      {},
      props.chainParameter,
      attributes.subspace ? { subspace: attributes.subspace } : {},
      attributes.key ? { key: attributes.key } : {},
      attributes.value ? { value: attributes.value } : {}
    );

    emit('update:chainParameter', chainParameter);
  };

  const removeChainParameter = () => {
    emit('remove:chainParameter');
  };
</script>

<template>
  <div class="bg-gray-warm rounded-lg px-4 py-4 relative">
    <button class="absolute top-2 right-4" @click="removeChainParameter">
      <XCircleIcon class="w-6 h-6 text-gray-800" />
    </button>
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <TextInput
          label="Subspace"
          :model-value="chainParameter?.subspace"
          @update:model-value="v => updateChainParameter({ subspace: v })"
        />
      </div>
      <div class="flex-1">
        <TextInput label="Key" :model-value="chainParameter?.key" @update:model-value="v => updateChainParameter({ key: v })" />
      </div>
      <div class="flex-1">
        <TextInput label="Value" :model-value="chainParameter?.value" @update:model-value="v => updateChainParameter({ value: v })" />
      </div>
    </div>
  </div>
</template>
