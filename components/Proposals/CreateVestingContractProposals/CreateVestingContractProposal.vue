<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';

  import { Link, PrimaryButton, TextInput, TokenInput, ToggleInput } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useCreateVestingContractProposalMutation } from '@/data/useCreateVestingContractProposalMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';
  import { TokenAmount } from '@/domain';
  import { useConfig } from '@/composables';

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();
  const { tokenDenom } = useConfig();

  const receiverAddress = ref('');
  const clawbackAddress = ref('');
  const amount = ref<TokenAmount>(TokenAmount.zero(tokenDenom));
  const isAmountValid = ref(true);

  const totalVestingDuration = ref('');
  const cliffDuration = ref('');
  const cliffPercentage = ref('');

  const canStake = ref(false);
  const liquidStaking = ref(false);
  const canClawback = ref(true);

  const { mutate, loading } = await useCreateVestingContractProposalMutation(accountId.value, walletAddress);

  const isFormValid = () =>
    !!receiverAddress.value &&
    (!canClawback.value || !!clawbackAddress.value) &&
    isAmountValid.value &&
    Number(totalVestingDuration.value) &&
    Number(cliffDuration.value) &&
    (Number(cliffDuration.value) === 0 || Number(cliffPercentage.value));

  const createProposal = () => {
    if (!isFormValid()) return;

    const title = 'Create vesting contract proposal';
    const description = `Create a vesting contract with beneficiary ${
      receiverAddress.value
    }, for ${amount.value.formatWithCoin()}. \n\nVesting duration of ${totalVestingDuration.value} seconds, with cliff duration of ${
      cliffDuration.value
    } seconds, and a cliff percentage of ${cliffPercentage.value} %. \n\n${
      canClawback.value ? `Can be clawbacked into ${clawbackAddress.value}` : "Can't be clawbacked"
    }. Vesting tokens can${canStake.value ? '' : "'t"} be staked, and staking rewards are${canStake.value ? '' : "n't"} liquid.`;

    mutate(
      {
        title,
        description,
        receiverAddress: receiverAddress.value,
        clawbackAddress: canClawback.value ? clawbackAddress.value : undefined,
        amount: amount.value,
        totalVestingDuration: Number(totalVestingDuration.value),
        cliffDuration: Number(cliffDuration.value),
        cliffPercentage: cliffPercentage.value ? Number(cliffPercentage.value) : 0,
        canStake: canStake.value,
        liquidStaking: liquidStaking.value,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Create vesting proposal!" />);
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
  <div>
    <div class="space-y-6">
      <TextInput label="Receiver address" v-model="receiverAddress" />
      <TextInput
        label="Clawback address"
        v-model="clawbackAddress"
        v-if="canClawback"
        legend="Configurable address that is able to initiate the clawback function for this vesting contract."
      />
      <TokenInput label="Amount" v-model="amount" v-model:is-valid="isAmountValid" :hide-max-amount="true" />
      <div class="flex gap-8">
        <div class="w-1/2 space-y-8">
          <TextInput
            label="Total vesting duration (seconds)"
            v-model="totalVestingDuration"
            legend="The total amount of time required for the tokens in this contract to fully vest, beginning from the moment the contract is deployed. Tokens vest linearly over the duration of the value set, minus any cliff if configured. Use Google for an easy conversion to seconds from a human-readable time input."
          />
          <ToggleInput
            label="Can stake"
            v-model="canStake"
            legend="If yes, the receiver can choose to stake any vesting tokens in this contract. They are able to delegate to any validator on the network."
          />
          <ToggleInput
            label="Liquid staking rewards"
            v-model="liquidStaking"
            legend="If yes, the receiver can access any staking rewards accrued by their vested tokens before the cliff."
          />
          <ToggleInput
            label="Can clawback"
            v-model="canClawback"
            legend="If yes, a configurable address can clawback the vesting tokens from this vesting contract at any point into the future. This means the receiver can no longer access the tokens and when triggered any staked tokens will begin their unbonding."
          />
        </div>
        <div class="w-1/2 space-y-8">
          <TextInput
            label="Cliff duration (seconds)"
            v-model="cliffDuration"
            legend="The time that must pass since the vesting contract is deployed to where the vested tokens become liquid to the receiver. This value must be less than the total vesting duration. Can be set to 0 to ignore this feature."
          />
          <div class="flex flex-row space-x-2">
            <TextInput
              label="Cliff percentage"
              v-model="cliffPercentage"
              legend="Determines how much of the total vesting tokens unlock at the time of the cliff, if configured."
            />
            <span class="flex pt-12">%</span>
          </div>
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
  </div>
</template>
