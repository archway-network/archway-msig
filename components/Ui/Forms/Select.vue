<script lang="ts" setup generic="TValue extends string | number | boolean | object | null | undefined, TOption">
  import { ListboxLabel, Listbox, ListboxButton, ListboxOptions } from '@headlessui/vue';
  import ChevronDownIcon from '@/components/Ui/Icons/ChevronDownIcon.vue';
  import SelectOption from './SelectOption.vue';

  type Props = {
    modelValue: TValue;
    placeholder?: string;
    options?: TOption[];
    disabled?: boolean;
    label?: string;
    getValue: (o: TOption) => TValue;
    getKey?: (o: TOption) => string;
  };

  defineEmits<{
    (e: 'update:modelValue', value: TValue): void;
  }>();

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
  });

  const getKey = computed(() => props.getKey ?? props.getValue);
</script>

<template>
  <div class="relative">
    <Listbox
      :model-value="props.modelValue"
      v-slot="{ open }"
      :disabled="disabled"
      @update:model-value="v => $emit('update:modelValue', v)"
    >
      <ListboxLabel v-if="label">
        <span class="label pb-3">{{ label }}</span>
      </ListboxLabel>

      <ListboxButton class="h-12 w-full p-4 bg-white caption text-gray-800 border border-gray-warm rounded-lg">
        <div class="flex flex-row justify-between items-center h-full">
          <div class="truncate">
            <slot name="selected" v-bind="{ value: modelValue, open, disabled }">
              <span class="font-medium">
                {{ JSON.stringify(modelValue) || placeholder }}
              </span>
            </slot>
          </div>
          <div class="flex items-center">
            <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': open }" />
          </div>
        </div>
      </ListboxButton>

      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-10">
        <ListboxOptions
          class="absolute w-full max-h-60 overflow-auto px-4 py-4 space-y-3 rounded-2xl bg-white focus:outline-none shadow-[0px_0px_128px_-8px_rgba(0,0,0,0.14)] z-50"
        >
          <template v-for="option in options" :key="getKey(option)">
            <slot name="option" v-bind="{ option, disabled }">
              <SelectOption :disabled="disabled" :value="getValue(option)">
                {{ JSON.stringify(option) }}
              </SelectOption>
            </slot>
          </template>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>
