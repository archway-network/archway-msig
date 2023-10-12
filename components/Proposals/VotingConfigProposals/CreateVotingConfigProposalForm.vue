<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput, ToggleInput } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { AccountVotingConfiguration } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useUpdateAccountVotingConfigurationMutation } from '@/data/useUpdateAccountVotingConfigurationMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const props = defineProps<{
    accountVotingConfiguration: AccountVotingConfiguration;
  }>();
  const emit = defineEmits(['close']);

  const title = ref('Update voting configuration proposal');
  const description = ref('');
  const passingThresholdMajority = ref(props.accountVotingConfiguration.passingThresholdMajority);
  const passingThreshold = ref(props.accountVotingConfiguration.passingThreshold.toString());
  const quorumEnabled = ref(props.accountVotingConfiguration.quorumEnabled);
  const quorumThresholdMajority = ref(props.accountVotingConfiguration.quorumThresholdMajority);
  const quorumThreshold = ref(props.accountVotingConfiguration.quorumThreshold.toString());
  const votingDuration = ref(props.accountVotingConfiguration.votingDuration.toString());
  const allowRevoting = ref(props.accountVotingConfiguration.allowRevoting);

  const calculatedDescription = computed(() => {
    return [
      description.value ? description.value + '\n' : '',
      'Voting Config:',
      `Passing threshold (percentage): ${passingThresholdMajority.value ? 'majority (>50%)' : `${passingThreshold.value}%`}`,
      `Quorum enabled: ${quorumEnabled.value ? 'yes' : 'no'}`,
      quorumEnabled.value
        ? `Quorum threshold (percentage): ${quorumThresholdMajority.value ? 'majority (>50%)' : `${quorumThreshold.value}%`}`
        : '',
      `Voting duration (seconds): ${votingDuration.value}`,
      `Allow revoting: ${allowRevoting.value ? 'yes' : 'no'}`,
    ]
      .filter(Boolean)
      .join('\n');
  });

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const { mutate, loading } = await useUpdateAccountVotingConfigurationMutation(accountId.value, walletAddress);

  const createProposal = () => {
    mutate(
      {
        title: title.value,
        description: calculatedDescription.value,
        passingThresholdMajority: passingThresholdMajority.value,
        passingThreshold: passingThreshold.value,
        quorumEnabled: quorumEnabled.value,
        quorumThresholdMajority: quorumThresholdMajority.value,
        quorumThreshold: quorumThreshold.value,
        votingDuration: votingDuration.value as any | 0,
        allowRevoting: allowRevoting.value,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Voting config proposal!" />);
          emit('close');
        },
        onError: () => {
          emit('close');
        },
      }
    );
  };
</script>

<template>
  <div class="space-y-6">
    <TextareaInput label="Proposal description" v-model="description" />
    <div class="flex gap-6">
      <div class="w-1/2">
        <div class="pb-2 caption text-gray-800">Passing threshold (percentage)</div>
        <div class="flex items-center space-x-4">
          <div class="w-1/2 py-4">
            <ToggleInput label="Majority (>50%)" v-model="passingThresholdMajority" />
          </div>
          <div class="w-1/2" v-if="!passingThresholdMajority">
            <TextInput v-model="passingThreshold" />
          </div>
        </div>
        <div class="text-align pt-3 small text-gray">
          Passing threshold works differently depending on whether your account has a quorum. - If your account has *no quorum*, this is the
          percentage of the account's voting power that must vote 'yes' for a proposal to pass. - If your account *has a quorum*, the
          passing threshold is only calculated from those who voted.
        </div>
      </div>
      <div class="w-1/2">
        <div class="pb-1">
          <ToggleInput label="Quorum (percentage)" v-model="quorumEnabled" />
        </div>
        <div class="flex items-center space-x-4" v-if="quorumEnabled">
          <div class="w-1/2 py-4">
            <ToggleInput label="Majority (>50%)" v-model="quorumThresholdMajority" />
          </div>
          <div class="w-1/2" v-if="!quorumThresholdMajority">
            <TextInput v-model="quorumThreshold" />
          </div>
        </div>
        <div class="text-align pt-3 small text-gray">
          The minimum percentage of voting power that must vote on a proposal for it to be considered. If you have an account with many
          inactive members, setting this value too high may make it difficult to pass proposals.
        </div>
      </div>
    </div>
    <div class="flex gap-6">
      <div class="w-1/2">
        <TextInput
          class="!w-1/2"
          label="Voting duration (seconds)"
          legend="The amount of time proposals are open for voting. A low proposal duration may increase the speed at which your account can pass proposals. Setting the duration too low may make it difficult for proposals to pass as voters will have limited time to vote. After this time elapses, the proposal will either pass or fail."
          v-model="votingDuration"
        />
      </div>
      <div class="w-1/2">
        <ToggleInput
          label="Allow revoting"
          legend="This will allow members to change their vote on proposals before the voting duration deadline. As a result, proposals will not be able to finish early."
          v-model="allowRevoting"
        />
      </div>
    </div>
  </div>
  <div class="flex flex-row justify-between pt-8">
    <Link @click="emit('close')">Cancel</Link>
    <div class="flex flex-row space-x-2">
      <PrimaryButton
        :disabled="transactionsStore.isInProgress && !loading"
        :loading="transactionsStore.isInProgress && loading"
        @click="createProposal"
      >
        Create Proposal
      </PrimaryButton>
    </div>
  </div>
</template>
