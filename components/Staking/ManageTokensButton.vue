<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { Link, SecondaryButton } from '@/components/Ui';
  import ManageTokensModal from './ManageTokensModal.vue';
  import { useModals } from '@/composables';
  import { Validator } from '@/domain/';

  const { isOpen, openModal, closeModal } = useModals(false);

  const props = defineProps({
    isLinkButton: { type: Boolean, default: false },
    validator: { type: Object as PropType<Validator>, required: true },
  });

  const buttonType = computed(() => {
    if (props.isLinkButton) {
      return Link;
    }
    return SecondaryButton;
  });
</script>

<template>
  <component :is="buttonType" @click="openModal">
    <slot></slot>
    <ManageTokensModal :validator="validator" :is-open="isOpen" @close="closeModal" v-if="isOpen" />
  </component>
</template>
