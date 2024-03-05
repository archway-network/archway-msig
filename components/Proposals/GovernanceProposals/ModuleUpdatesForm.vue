<script lang="ts" setup>
  import { Label, ListForm } from '@/components/Ui';
  import ModuleUpdateForm from '@/components/Proposals/GovernanceProposals/ModuleUpdateForm.vue';

  import { ModuleUpdate, updatableModules } from '@/types';

  type Props = {
    modelValue: Partial<ModuleUpdate>[];
    label?: string;
    required?: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
  });

  const moduleUpdates = toRef(props, 'modelValue');

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Partial<ModuleUpdate>[]): void;
  }>();

  // Handle edits
  const createNewItem = () => {
    return {
      moduleName: modulesOptions.value.find(x => !x.disabled)?.value,
      params: undefined,
    };
  };

  const add = () => {
    const newModuleUpdates = [...moduleUpdates.value, createNewItem()];
    emit('update:modelValue', newModuleUpdates);
  };

  // Select module options
  const modulesOptions = computed(() =>
    updatableModules.map(mod => ({
      disabled: moduleUpdates.value.some(x => x.moduleName === mod),
      value: mod,
    }))
  );

  const hasAvailableModules = computed(() => modulesOptions.value.some(x => !x.disabled));

  // Init entries
  onMounted(() => {
    if (!moduleUpdates.value.length) {
      add();
    }
  });
</script>

<template>
  <div class="space-y-3">
    <Label :label="label" :required="required" />
    <ListForm
      extendable
      :model-value="modelValue"
      :can-add="() => hasAvailableModules"
      :create-new-item="createNewItem"
      :get-key="item => item.moduleName!"
      @update:model-value="values => $emit('update:modelValue', values)"
      v-slot="{ item, update, remove, isRemoveAvailable }"
    >
      <div class="pb-6">
        <ModuleUpdateForm
          :model-value="item"
          :key="item.moduleName"
          :modules-options="modulesOptions"
          :disabled-remove="!isRemoveAvailable"
          @update:model-value="update"
          @remove="remove"
        />
      </div>
    </ListForm>
  </div>
</template>
