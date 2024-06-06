<script lang="ts" setup>
  import { type PropType } from 'vue';

  import ChevronsDownIcon from '@/components/Ui/Icons/ChevronsDownIcon.vue';

  import { SortDirection } from '@/types/index';

  const props = defineProps({
    selectedId: { type: [String, Number], required: true },
    direction: { type: String as PropType<SortDirection>, default: 'DESC' },
    sortId: { type: [String, Number], required: true },
  });
  const emit = defineEmits(['update:selectedId', 'update:direction']);

  const isSelected = computed(() => props.selectedId === props.sortId);

  const handleClick = () => {
    if (isSelected.value) {
      emit('update:direction', props.direction === 'ASC' ? 'DESC' : 'ASC');
    } else {
      emit('update:selectedId', props.sortId);
    }
  };
</script>

<template>
  <span
    :class="[{ 'text-orange': isSelected }, 'text-gray-800 inline-flex items-center space-x-2 cursor-pointer z-20']"
    @click="handleClick"
  >
    <span>
      <slot></slot>
    </span>
    <div class="w-4 h-4">
      <ChevronsDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': direction === SortDirection.ASC }" />
    </div>
  </span>
</template>
