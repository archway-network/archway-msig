<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { GovernanceProposalVotes } from '@/domain';

  defineProps({
    votes: { type: Object as PropType<GovernanceProposalVotes>, required: true },
  });
</script>

<template>
  <div>
    <div class="h-1 bg-gray-400 relative">
      <div :class="`absolute left-0 h-1 bg-red`" :style="{ width: `${votes.percentages.noWithVeto}%` }" />
      <div
        :class="`absolute h-1 bg-orange`"
        :style="{ left: `${votes.percentages.noWithVeto}%`, width: `${votes.percentages.noWithoutVeto}%` }"
      />
      <div :class="`absolute h-1 bg-green-700`" :style="{ left: `${votes.percentages.allNo}%`, width: `${votes.percentages.yes}%` }" />
    </div>
  </div>
</template>
