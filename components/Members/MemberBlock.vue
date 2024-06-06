<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { TextInput } from '@/components/Ui';
  import { Member } from '@/domain';

  const props = defineProps({
    member: { type: Object as PropType<Member>, required: true },
  });
  const emit = defineEmits(['update:block', 'remove:block']);

  const updateBlock = (attributes: { weight?: number; addr?: string }) => {
    const member = Member.make({ weight: props.member.weight || 1, addr: props.member.addr, ...attributes });

    emit('update:block', member);
  };

  const removeBlock = () => {
    emit('remove:block');
  };
</script>

<template>
  <div class="bg-gray-warm rounded-lg px-4 py-4 relative">
    <button class="absolute top-2 right-4" @click="removeBlock">
      <XCircleIcon class="w-6 h-6 text-gray-800" />
    </button>
    <div class="flex items-center space-x-4">
      <div class="w-30">
        <TextInput
          class="text-center"
          label="Voting Weight"
          placeholder="1"
          :model-value="member.weight?.toString()"
          @update:model-value="v => updateBlock({ weight: v as unknown as number })"
        />
      </div>
      <div class="flex-1">
        <TextInput
          label="Address"
          placeholder="enter an address..."
          :model-value="member.addr"
          @update:model-value="v => updateBlock({ addr: v })"
        />
      </div>
    </div>
  </div>
</template>
