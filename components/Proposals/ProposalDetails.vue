<script lang="ts" setup>
  import { type PropType } from 'vue';
  import MarkdownIt from 'markdown-it';

  import ProposalHeading from '@/components/Proposals/ProposalHeading.vue';
  import ProposalVotes from '@/components/Proposals/ProposalVotes.vue';
  import ProposalVotingOverview from '@/components/Proposals/ProposalVotingOverview.vue';
  import ProposalVoteButton from '@/components/Proposals/ProposalVoteButton.vue';
  import ProposalExecuteButton from '@/components/Proposals/ProposalExecuteButton.vue';
  import ProposalCloseButton from '@/components/Proposals/ProposalCloseButton.vue';
  import ProposalMessages from '@/components/Proposals/ProposalMessages.vue';
  import { Proposal } from '@/domain';
  import { useAuthStore } from '@/store';

  const props = defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
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
      <div class="text-gray-800 caption pb-6">Voting deadline {{ proposal.formatted.votingDeadline }}</div>
      <ProposalVotes class="pb-8" :proposal="proposal" />
      <div class="markdown flex flex-col space-y-2 break-words" v-html="html" />
      <ProposalMessages :messages="proposal.msgs" class="pt-6" />
    </div>
    <div class="w-2/5 flex flex-col divide-y divide-gray-warm">
      <div class="flex-1 px-12 pt-24 pb-6">
        <div class="pb-9 font-medium">Proposal Overview</div>
        <div class="divide-y divide-gray-warm">
          <ProposalVotingOverview class="pb-8" :proposal="proposal" />
        </div>
      </div>
      <div class="flex justify-end pt-6 pb-12 px-12" v-if="proposal.isInProgress() && auth.isAuthenticated">
        <ProposalVoteButton :proposal="proposal" @close="emit('close')" />
      </div>
      <div class="flex justify-end pt-6 pb-12 px-12" v-if="proposal.isPasssed() && auth.isAuthenticated">
        <ProposalExecuteButton :proposal="proposal" @close="emit('close')" />
      </div>
      <div class="flex justify-end pt-6 pb-12 px-12" v-if="proposal.canBeClosed() && auth.isAuthenticated">
        <ProposalCloseButton :proposal="proposal" @close="emit('close')" />
      </div>
    </div>
  </div>
</template>
