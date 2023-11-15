<script lang="ts" setup>
  import { watch } from 'vue';
  import ModuleParametersChange from '@/components/Proposals/GovernanceProposals/ModuleParametersChange.vue';
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { Select, SelectOption } from '@/components/Ui';
  import { ModuleUpdate, UpdatableModule, updatableModules } from '@/types';

  type Props = {
    modelValue: Partial<ModuleUpdate>;
    modulesOptions: { value: UpdatableModule; disabled: boolean }[];
    disabledRemove?: boolean;
  };

  const emit = defineEmits<{
    (e: 'remove'): void;
    (e: 'update:modelValue', value: Partial<ModuleUpdate>): void;
  }>();

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => ({ moduleName: undefined, params: undefined }),
    modulesOptions: () => updatableModules.map(mod => ({ value: mod, disabled: false })),
  });

  // Handle inputs
  const moduleName = ref<UpdatableModule | undefined>(props.modelValue.moduleName);
  watch(moduleName, newModuleName => {
    emit('update:modelValue', { moduleName: newModuleName, params: params.value });
  });

  const params = ref<Record<string, any> | undefined>(props.modelValue.params);
  watch(params, newParams => {
    emit('update:modelValue', { moduleName: moduleName.value, params: newParams });
  });

  const removeChainParameter = () => {
    emit('remove');
  };
</script>

<template>
  <div class="bg-gray-warm rounded-lg px-4 py-4 relative">
    <button v-if="!disabledRemove" class="absolute top-3 right-3" @click="removeChainParameter">
      <XCircleIcon class="w-6 h-6 text-gray-800" />
    </button>
    <div class="flex flex-col sm:flex-row gap-4">
      <Select class="w-48" placeholder="Module" label="Module" v-model="moduleName" :get-value="o => o.value" :options="modulesOptions">
        <template #selected="{ value }">{{ value ? `x/${value}` : undefined }}</template>
        <template #option="{ option }">
          <SelectOption :value="option.value" :disabled="option.disabled"> x/{{ option.value }} </SelectOption>
        </template>
      </Select>
      <ModuleParametersChange v-if="moduleName" v-model="params" :moduleName="moduleName" class="flex-1" />
    </div>
  </div>
</template>
