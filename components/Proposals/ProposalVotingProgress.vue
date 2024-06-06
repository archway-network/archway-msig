<script lang="ts" setup>
  import { type PropType } from 'vue';

  const props = defineProps({
    votes: { type: Object as PropType<{ yes: number; no: number; abstain: number }>, required: true },
  });

  const totalVotes = computed(() => props.votes.yes + props.votes.no + props.votes.abstain);
  const noBarWidth = computed(() => (props.votes.no / totalVotes.value) * 100);
  const abstainBarWidth = computed(() => (props.votes.abstain / totalVotes.value) * 100);
  const yesBarWidth = computed(() => (props.votes.yes / totalVotes.value) * 100);
</script>

<template>
  <div>
    <div class="h-1 bg-gray-400 relative">
      <div :class="`absolute left-0 h-1 bg-red`" :style="{ width: `${noBarWidth}%` }" />
      <div :class="`absolute h-1 bg-green-700`" :style="{ left: `${noBarWidth}%`, width: `${yesBarWidth}%` }" />
    </div>
  </div>
</template>
