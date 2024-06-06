<script lang="tsx" setup>
  import { ref, type PropType } from 'vue';
  import { storeToRefs } from 'pinia';

  import { Link, PrimaryButton, TextInput, TextareaInput, TokenInput } from '@/components/Ui';
  import TreasurySpendBlocks from '../TreasurySpendProposals/TreasurySpendBlocks.vue';
  import ModuleUpdatesForm from './ModuleUpdatesForm.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useGovernanceProposalMutation } from '@/data/useGovernanceProposalMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';
  import { TokenAmount } from '@/domain';
  import { useConfig } from '@/composables';

  import { type ModuleUpdate, GovernanceProposalType, type TreasurySpendBlock } from '@/types';
  import { useModuleAddress } from '@/data/useModuleAddress';

  const props = defineProps({
    type: { type: String as PropType<GovernanceProposalType>, required: true },
  });

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();
  const { tokenDenom } = useConfig();

  const title = ref('');
  const description = ref('');
  const depositAmount = ref<TokenAmount>(TokenAmount.zero(tokenDenom));
  const isDepositAmountValid = ref(true);
  const spendBlocks = ref<TreasurySpendBlock[]>([]);
  const parameterChanges = ref<Partial<ModuleUpdate>[]>([]);
  const upgradePlan = ref('');
  const { address: authority } = useModuleAddress('gov');

  const { mutate, loading } = await useGovernanceProposalMutation(accountId.value, walletAddress);

  const filteredSpendBlocks = computed(() => spendBlocks.value.filter(block => !!block.amount && !!block.address));
  const filteredParameterChanges = computed(
    () => parameterChanges.value.filter(update => !!update.params && !!update.moduleName) as ModuleUpdate[]
  );

  const calculateDescription = () => {
    switch (props.type) {
      case GovernanceProposalType.COMMUNITY_POOL_SPEND:
        const toSpend = filteredSpendBlocks.value.map(block => `${block.amount.formatWithCoin()} @ ${block.address}`).join('\n');
        return [description.value, toSpend ? 'Spend: ' + '\n' + toSpend : ''].filter(Boolean).join('\n\n');
      case GovernanceProposalType.PARAMETER_CHANGE:
        const updatedModules = filteredParameterChanges.value.map(update => `${update.moduleName}`).join(', ');
        return [description.value, updatedModules ? `Updated Modules: ${updatedModules}` : ''].join('\n\n');
      case GovernanceProposalType.SOFTWARE_UPGRADE:
        return [description.value, 'Software Upgrade Plan:', JSON.stringify(JSON.parse(upgradePlan.value), undefined, 2)]
          .filter(Boolean)
          .join('\n\n');
      case GovernanceProposalType.CANCEL_SOFTWARE_UPGRADE:
        return [description.value, 'Cancel Software Upgrade'].filter(Boolean).join('\n\n');
      default:
        return description.value;
    }
  };

  const isFormValid = () => {
    if (!isDepositAmountValid.value) return false;

    switch (props.type) {
      case GovernanceProposalType.TEXT:
        if (!description.value.trim()) return false;
        break;
      case GovernanceProposalType.COMMUNITY_POOL_SPEND:
        if (filteredSpendBlocks.value.length === 0) return false;
        break;
      case GovernanceProposalType.PARAMETER_CHANGE:
        if (filteredParameterChanges.value.length === 0) return false;
        break;
      case GovernanceProposalType.SOFTWARE_UPGRADE:
        if (!upgradePlan.value) return false;

        try {
          JSON.parse(upgradePlan.value);
        } catch {
          return false;
        }
        break;
    }

    return true;
  };

  const createGovernanceProposal = () => {
    if (!isFormValid()) return;

    mutate(
      {
        title: title.value,
        description: calculateDescription(),
        deposit: depositAmount.value,
        type: props.type,
        spend: props.type === GovernanceProposalType.COMMUNITY_POOL_SPEND ? filteredSpendBlocks.value : undefined,
        parameterChanges: props.type === GovernanceProposalType.PARAMETER_CHANGE ? filteredParameterChanges.value : undefined,
        upgradePlan: props.type === GovernanceProposalType.SOFTWARE_UPGRADE ? JSON.parse(upgradePlan.value) : undefined,
        authority: authority.value,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Governance proposal!" />);
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
      <TextInput label="Proposal title" v-model="title" />
      <TextareaInput label="Proposal description" v-model="description" />
      <TokenInput label="Initial deposit amount" v-model="depositAmount" v-model:is-valid="isDepositAmountValid" :hide-max-amount="true" />
      <TreasurySpendBlocks label="Proposed spends" v-model="spendBlocks" v-if="type === GovernanceProposalType.COMMUNITY_POOL_SPEND" />
      <ModuleUpdatesForm label="Parameter changes" v-model="parameterChanges" v-if="type === GovernanceProposalType.PARAMETER_CHANGE" />
      <TextareaInput label="Upgrade plan" v-model="upgradePlan" rows="8" v-if="type === GovernanceProposalType.SOFTWARE_UPGRADE" />
    </div>
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="transactionsStore.isInProgress && !loading"
          :loading="transactionsStore.isInProgress && loading"
          @click="createGovernanceProposal"
        >
          Create Proposal
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
