<script lang="ts" setup>
  import { type PropType } from 'vue';

  import { ValidatorStatus } from '@/types';

  const props = defineProps({
    status: { type: String as PropType<ValidatorStatus>, required: true },
  });

  const active = computed(() => props.status === ValidatorStatus.BONDED);
</script>

<template>
  <span class="inline-block w-2 h-2 rounded-full" :class="{ 'bg-green': active, 'bg-red': !active }" />
</template>
