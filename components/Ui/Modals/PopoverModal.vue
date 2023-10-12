<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

  import CloseIcon from '@/components/Ui/Icons/CloseIcon.vue';

  defineProps({
    isOpen: { type: Boolean, default: false },
  });

  const attr = useAttrs();

  const emit = defineEmits(['close']);
</script>

<template>
  <ClientOnly>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-50" @close="() => emit('close')">
        <TransitionChild
          as="div"
          class="fixed w-[327px] bottom-0 right-0 transform mt-4 mr-4 mb-4 z-40"
          enter="transition duration-200 ease-out"
          enter-from="translate-y-1 opacity-0"
          enter-to="translate-y-0 opacity-100"
          leave="transition duration-150 ease-in"
          leave-from="translate-y-0 opacity-100"
          leave-to="translate-y-1 opacity-0"
        >
          <DialogPanel
            :class="[
              'relative transform overflow-hidden rounded-2xl bg-white transition-all sm:my-8 sm:w-full max-w-2xl',
              'shadow-[-8px_0px_124px_rgba(0,0,0,0.16)]',
              `flex flex-col`,
            ]"
            v-bind="attr"
          >
            <div class="absolute top-0 right-0 hidden pt-6 pr-6 sm:block">
              <button type="button" class="text-black hover:text-black/80 focus:outline-none" @click="emit('close')">
                <span class="sr-only">Close</span>
                <CloseIcon class="w-6 h-6" />
              </button>
            </div>
            <div class="flex-1 flex flex-col">
              <slot></slot>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>
