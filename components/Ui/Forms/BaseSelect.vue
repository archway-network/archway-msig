<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';

  import ChevronDownIcon from '@/components/Ui/Icons/ChevronDownIcon.vue';

  import { SelectOption } from '@/types';

  const props = defineProps({
    placeholder: { type: String },
    options: { type: Object as PropType<Array<SelectOption>>, required: true },
    modelValue: { type: Object as PropType<SelectOption> },
    disabled: { type: Boolean, default: false },
  });
</script>

<template>
  <div class="relative">
    <Listbox
      v-slot="{ open }"
      :modelValue="modelValue"
      @update:modelValue="value => $emit('update:modelValue', value)"
      :disabled="disabled"
    >
      <ListboxButton class="w-full p-4 bg-white caption text-gray-800 border border-gray-warm rounded-lg">
        <div class="flex flex-row justify-between">
          <span class="truncate font-medium">{{ modelValue?.label || placeholder }}</span>
          <div class="flex items-center">
            <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': open }" />
          </div>
        </div>
      </ListboxButton>
      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-10">
        <ListboxOptions
          class="absolute w-full max-h-60 overflow-auto px-4 py-4 space-y-4 rounded-2xl bg-white focus:outline-none shadow-[0px_0px_128px_-8px_rgba(0,0,0,0.14)] z-50"
        >
          <ListboxOption v-slot="{ active, selected }" v-for="item in options" :key="item.value" :value="item">
            <li :class="[{ '!bg-gray-200': active, 'bg-gray-100': selected }, 'relative cursor-pointer rounded-lg flex space-x-4 p-2']">
              <span class="font-medium">{{ item.label }}</span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>
