<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { PlusIcon } from '@heroicons/vue/24/solid';
  import { PrimaryButton } from '@/components/Ui';
  import MemberBlock from '@/components/Members/MemberBlock.vue';
  import { Member } from '~/domain';

  const props = defineProps({
    modelValue: { type: Array as PropType<Member[]>, default: () => [] },
  });
  const emit = defineEmits(['update:modelValue']);

  const members = computed<Member[]>(() => (props.modelValue.length > 0 ? props.modelValue : [Member.make([])]));

  const add = () => {
    emit('update:modelValue', [...members.value, Member.make([])]);
  };

  const update = (index: number, member: Member) => {
    const blocks = [...members.value];
    blocks.splice(index, 1, member);

    emit('update:modelValue', [...blocks]);
  };

  const remove = (index: number) => {
    const blocks = [...members.value];
    blocks.splice(index, 1);

    emit('update:modelValue', [...blocks]);
  };
</script>

<template>
  <template v-for="(member, index) in members">
    <MemberBlock :member="member" @update:block="member => update(index, member)" @remove:block="() => remove(index)" />
  </template>
  <PrimaryButton class="h-9" @click="add">
    <PlusIcon class="w-4 h-4" />
  </PrimaryButton>
</template>
