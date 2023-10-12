<script lang="ts" setup>
  import { computed, ref, onMounted, PropType } from 'vue';
  import MarkdownIt from 'markdown-it';

  import ProposalHeading from '@/components/Governance/ProposalHeading.vue';
  import ProposalVotingOverview from '@/components/Governance/ProposalVotingOverview.vue';
  import ProposalDetailsOverview from '@/components/Governance/ProposalDetailsOverview.vue';
  import ProposalVoteButton from '@/components/Governance/ProposalVoteButton.vue';
  import { GovernanceProposal } from '@/domain';
  import { useAuthStore } from '@/store';

  const props = defineProps({
    proposal: { type: Object as PropType<GovernanceProposal>, required: true },
  });

  const emit = defineEmits(['close']);

  const auth = useAuthStore();

  const markdown = ref();

  onMounted(() => {
    markdown.value = new MarkdownIt('commonmark', {
      linkify: false,
    });
  });

  const html = computed(() => {
    if (!markdown.value) return '';

    return markdown.value.disable(['link', 'image']).render(props.proposal.description);
  });
</script>

<template>
  <div class="flex-1 flex divide-x divide-gray-warm text-left">
    <div class="flex flex-col w-3/5 px-12 py-12">
      <ProposalHeading class="flex items-center space-x-2 pb-6" :id="proposal.id" :status="proposal.status" />
      <h2 class="title-3 pb-2">{{ proposal.title }}</h2>
      <div class="text-gray-800 pb-9">Submitted {{ proposal.formatted.createdAt }}</div>
      <div class="flex-1">
        <div class="markdown flex flex-col space-y-2" v-html="html" />
      </div>
    </div>
    <div class="w-2/5 flex flex-col divide-y divide-gray-warm">
      <div class="flex-1 px-12 pt-24 pb-6">
        <div class="pb-9 font-bold">Proposal Overview</div>
        <div class="divide-y divide-gray-warm">
          <ProposalVotingOverview class="pb-8" :proposal="proposal" />
          <ProposalDetailsOverview class="pt-8" :proposal="proposal" />
        </div>
      </div>
      <div class="flex justify-end pt-6 pb-12 px-12" v-if="proposal.isInProgress() && auth.isAuthenticated">
        <ProposalVoteButton :proposal-id="proposal.id" @close="emit('close')" />
      </div>
    </div>
  </div>
</template>

<style>
  .markdown ol li {
    margin-left: 40px;
    list-style-type: decimal;
  }
  .markdown ul li {
    margin-left: 40px;
    list-style-type: circle;
  }
</style>
