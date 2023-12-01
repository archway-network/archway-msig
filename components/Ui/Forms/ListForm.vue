<script lang="ts" setup generic="TValue">
  import { PrimaryButton } from '@/components/Ui';
  import { PlusIcon } from '@heroicons/vue/24/solid';

  type Props = {
    modelValue: TValue[];
    createNewItem: () => TValue;
    getKey?: (v: TValue, index: number) => string | number;
    canRemove?: (item: TValue, index: number, items: TValue[]) => boolean;
    canAdd?: (items: TValue[]) => boolean;
    extendable?: boolean;
    disabled?: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [] as TValue[],
    getKey: (v: TValue, index: number) => JSON.stringify(v),
  });

  const canRemove = computed(() => {
    return props.canRemove ?? (() => props.modelValue.length > 1);
  });

  const canAdd = computed(() => {
    return props.canAdd ?? (() => true);
  });
  const isAddingAvailable = computed(() => canAdd.value(props.modelValue));

  const emit = defineEmits<{
    (e: 'update:modelValue', values: TValue[]): void;
  }>();

  const add = () => {
    if (!isAddingAvailable.value) return;
    const newItems = [...props.modelValue, props.createNewItem()];
    emit('update:modelValue', newItems);
  };

  const update = (index: number, value: TValue) => {
    const newItems = [...props.modelValue];
    newItems.splice(index, 1, value);

    emit('update:modelValue', newItems);
  };

  const remove = (index: number, value: TValue) => {
    if (!canRemove.value(value, index, props.modelValue)) return;
    const newItems = [...props.modelValue];
    newItems.splice(index, 1);

    emit('update:modelValue', newItems);
  };
</script>

<template>
  <div>
    <div>
      <template v-for="(item, index) in modelValue" :key="getKey(item, index)">
        <slot
          v-bind="{
            item,
            index,
            update: (value: TValue) => update(index, value),
            remove: () => remove(index, item),
            isRemoveAvailable: canRemove(item, index, modelValue),
          }"
        />
      </template>
    </div>
    <slot name="add" v-bind="{ add }">
      <PrimaryButton v-if="extendable" class="h-9" @click="add()" :disabled="disabled || !isAddingAvailable">
        <PlusIcon class="w-4 h-4" />
      </PrimaryButton>
    </slot>
  </div>
</template>
