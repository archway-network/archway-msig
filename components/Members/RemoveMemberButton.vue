<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { Link } from '@/components/Ui';
  import RemoveMemberModal from './RemoveMemberModal.vue';
  import { useModals } from '@/composables';
  import { Member } from '@/domain';

  const { isOpen, openModal, closeModal } = useModals(false);

  defineProps({
    member: { type: Object as PropType<Member>, required: true },
  });
</script>

<template>
  <Link @click="openModal">
    Remove
    <RemoveMemberModal :member="member" :is-open="isOpen" @close="closeModal" v-if="isOpen" />
  </Link>
</template>
