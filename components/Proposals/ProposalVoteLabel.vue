<script lang="ts" setup>
  import { PropType } from 'vue';
  import { HandThumbUpIcon, HandThumbDownIcon, HandRaisedIcon } from '@heroicons/vue/24/outline';

  import { ProposalVoteOption } from '@/types';

  defineProps({
    vote: { type: String as PropType<ProposalVoteOption>, required: true },
  });
</script>

<template>
  <label
    class="flex items-center space-x-1"
    :class="{
      'text-green': vote === 'yes',
      'text-red': vote === 'no',
      'text-orange': vote === 'abstain',
    }"
  >
    <HandThumbUpIcon class="w-4 h-4" v-if="vote === 'yes'" />
    <HandThumbDownIcon class="w-4 h-4" v-if="vote === 'no'" />
    <HandRaisedIcon class="w-4 h-4" v-if="vote === 'abstain'" />
    <span class="caption">{{ vote }}</span>
  </label>
</template>
