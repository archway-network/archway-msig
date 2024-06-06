<script lang="tsx" setup>
  import { type PropType } from 'vue';
  import { DefaultModal } from '@/components/Ui';
  import RemoveMemberProposal from '@/components/Members/RemoveMemberProposal.vue';

  import { Member } from '@/domain/';

  defineProps({
    isOpen: { type: Boolean, default: false },
    member: { type: Object as PropType<Member>, required: true },
  });
  const emit = defineEmits(['close']);
</script>

<template>
  <DefaultModal :is-open="isOpen" @close="emit('close')">
    <div class="flex-1 flex flex-col text-left px-12 py-12">
      <h2 class="title-5 pb-8">Remove Member</h2>
      <p>
        Are you sure you want to remove this member?<br /><br /><span class="font-offbit">Spoorthi</span> the member is begging for mercy
        and will repent... 😿
      </p>
      <RemoveMemberProposal class="pt-8" :member="member" @close="emit('close')" />
    </div>
  </DefaultModal>
</template>
