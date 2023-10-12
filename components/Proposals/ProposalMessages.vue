<script lang="ts" setup>
  import { PropType } from 'vue';
  import VueJsonPretty from 'vue-json-pretty';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import _ from 'lodash';

  import { ChevronDownIcon } from '@/components/Ui';
  import { parseObjectWithEncodedMessages } from '@/utils';

  const props = defineProps({
    messages: { type: Object as PropType<Record<string, any> | Record<string, any>[]> },
  });

  const decoded = computed(() => {
    if (!props.messages) return;

    return parseObjectWithEncodedMessages(props.messages);
  });
</script>

<template>
  <div>
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
      >
        <span>On-chain proposed messages</span>
        <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': open }" />
      </DisclosureButton>
      <DisclosurePanel class="p-4 border border-gray-warm border-t-0 rounded-lg">
        <VueJsonPretty :data="decoded" />
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>
