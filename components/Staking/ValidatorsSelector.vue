<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { PropType, ref } from 'vue';
  import { Listbox, ListboxLabel, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
  import { Search, ChevronDownIcon } from '@/components/Ui';
  import ValidatorAvatar from '@/components/Staking/ValidatorAvatar.vue';
  import { Validator } from '@/domain';

  const props = defineProps({
    label: { type: String, default: 'Validator' },
    validators: { type: Object as PropType<Validator[]>, default: [] },
    modelValue: { type: Object as PropType<Validator>, default: undefined },
  });
  defineEmits(['update:modelValue']);

  const attr = useAttrs();

  const search = ref('');
  const filteredValidators = computed(() =>
    props.validators.filter(validator => validator.title.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))
  );
</script>

<template>
  <div>
    <Listbox v-slot="{ open }" :model-value="modelValue" @update:model-value="value => $emit('update:modelValue', value)">
      <ListboxLabel class="block caption text-gray-800 pb-2" v-if="label">{{ label }}</ListboxLabel>
      <ListboxButton class="w-full border border-gray-warm rounded-lg px-4 py-3" v-bind="attr">
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center space-x-2">
            <ValidatorAvatar :avatar="modelValue?.avatar" :name="modelValue?.title || ''" class="w-8 h-8" />
            <span class="block truncate caption">{{ modelValue?.title || '' }}</span>
          </div>
          <div class="flex items-center">
            <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': open }" />
          </div>
        </div>
      </ListboxButton>
      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions
          class="absolute w-[86%] max-h-60 flex flex-col overflow-hidden px-4 py-4 space-y-4 rounded-2xl bg-white focus:outline-none shadow-[0px_0px_128px_-8px_rgba(0,0,0,0.14)] z-50"
        >
          <div>
            <Search v-model="search" />
          </div>
          <div class="flex-1 overflow-y-scroll space-y-1">
            <ListboxOption v-slot="{ active, selected }" v-for="validator in filteredValidators" :value="validator">
              <li :class="[{ '!bg-gray-200': active, 'bg-gray-100': selected }, 'relative cursor-pointer rounded-lg flex space-x-4 p-2']">
                <div class="flex flex-row justify-between w-full">
                  <div class="flex flex-row items-center space-x-3">
                    <ValidatorAvatar :avatar="validator?.avatar" :name="validator?.title || ''" class="w-8 h-8 text-orange flex-shrink-0" />
                    <span class="font-medium">{{ validator.title }}</span>
                  </div>
                </div>
              </li>
            </ListboxOption>
          </div>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>
