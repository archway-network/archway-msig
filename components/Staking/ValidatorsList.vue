<script lang="ts" setup>
  import { PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import _ from 'lodash';

  import { CopyAddress, Sortable, TooltipWithIcon } from '@/components/Ui';
  import ValidatorAvatar from '@/components/Staking/ValidatorAvatar.vue';
  import StatusLabel from '@/components/Staking/StatusLabel.vue';
  import ValidatorVotingPower from '@/components/Staking/ValidatorVotingPower.vue';
  import ManageTokensButton from '@/components/Staking/ManageTokensButton.vue';
  import { useChainTotalDelegations } from '@/data/useChainTotalDelegations';
  import { Validator, ValidatorDelegation } from '@/domain';
  import { useAuthStore } from '@/store';

  import { SortDirection, TooltipPosition } from '@/types';
  import { SortField } from '@/types/validators';

  const props = defineProps({
    validators: { type: Array as PropType<Validator[]>, required: true },
    delegations: { type: Array as PropType<ValidatorDelegation[]>, optional: true },
    sortBy: { type: [String, Number], required: true },
    sortDirection: { type: String as PropType<SortDirection>, default: 'DESC' },
  });

  const { totalDelegated, loading: isLoadingTotalDelegations } = await useChainTotalDelegations();

  const emit = defineEmits(['update:sortBy', 'update:sortDirection']);

  const updateSortBy = (value: String | Number) => {
    emit('update:sortBy', value);
  };

  const updateSortDirection = (value: SortDirection) => {
    emit('update:sortDirection', value);
  };

  const delegationsByValidator = computed(() => _.keyBy(props.delegations, 'validator'));

  const { isAuthenticated } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="overflow-x-auto">
    <div class="inline-block min-w-full align-middle">
      <div class="overflow-hidden">
        <table class="min-w-full border-separate border-spacing-0 max-w-full">
          <thead>
            <tr>
              <th
                scope="col"
                class="z-10 border-b border-gray-warm bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left caption font-medium text-gray-800 sm:pl-6 lg:pl-8"
              >
                Validator
              </th>
              <th
                scope="col"
                class="hidden 2xl:table-cell whitespace-nowrap z-10 border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-left caption font-medium text-gray-800"
              >
                <Sortable
                  :selectedId="sortBy"
                  @update:selectedId="updateSortBy"
                  :direction="sortDirection"
                  @update:direction="updateSortDirection"
                  :sort-id="SortField.VOTING_POWER"
                >
                  Voting Power
                </Sortable>
              </th>
              <th
                scope="col"
                class="z-20 border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-right caption font-medium text-gray-800"
              >
                <Sortable
                  :selectedId="sortBy"
                  @update:selectedId="updateSortBy"
                  :direction="sortDirection"
                  @update:direction="updateSortDirection"
                  :sort-id="SortField.COMMISSION"
                >
                  <TooltipWithIcon
                    class="text-center"
                    text="This commission will be subtractred from your earnings (APR)"
                    width="200px"
                    :position="TooltipPosition.BOTTOM"
                  >
                    Commission
                  </TooltipWithIcon>
                </Sortable>
              </th>
              <th
                scope="col"
                class="whitespace-nowrap z-10 border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-left caption font-medium text-gray-800"
              >
                My Staked Tokens
              </th>
              <th
                scope="col"
                class="hidden 2xl:table-cell z-10 w-[100px] xl:w-[200px] border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-center caption font-medium text-gray-800"
              >
                Status
              </th>
              <th
                v-if="isAuthenticated"
                scope="col"
                class="z-10 w-[150px] xl:w-[200px] border-b border-gray-warm bg-white bg-opacity-75 py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
              >
                <span class="sr-only">Manage</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="validator in validators">
              <td class="py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                <div class="flex items-center">
                  <ValidatorAvatar class="flex-shrink-0" :avatar="validator.avatar" :name="validator.title" />
                  <div class="max-w-[160px] xl:max-w-[220px] 2xl:max-w-full ml-4 space-y-1">
                    <div class="font-bold block truncate">{{ validator.title }}</div>
                    <CopyAddress class="caption" :address="validator.id" />
                    <dl class="2xl:hidden flex space-x-2">
                      <dt class="label text-gray-800">Voting power</dt>
                      <dd class="label">
                        <ValidatorVotingPower :validator="validator" :total-delegated="totalDelegated" v-if="!isLoadingTotalDelegations" />
                      </dd>
                    </dl>
                    <a
                      class="block caption text-gray-800 truncate"
                      :href="`https://mintscan.io/archway/validators/${validator.id}`"
                      target="_blank"
                      rel="'noopener noreferrer'"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </td>
              <td class="hidden 2xl:table-cell whitespace-nowrap px-3 py-4 caption text-gray-800">
                <ValidatorVotingPower :validator="validator" :total-delegated="totalDelegated" v-if="!isLoadingTotalDelegations" />
              </td>
              <td class="whitespace-nowrap hidden px-3 py-4 text-right caption text-gray-800 lg:table-cell">
                {{ validator.formatted.commission }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 caption text-gray-800">
                {{ delegationsByValidator[validator.id]?.amount.formatWithCoin() }}
              </td>
              <td class="hidden 2xl:table-cell w-[100px] xl:w-[200px] px-3 py-4 text-center">
                <StatusLabel :status="validator.status" />
              </td>
              <td class="relative w-[150px] xl:w-[200px] py-4 pr-4 pl-3 text-right sm:pr-8 lg:pr-8">
                <ManageTokensButton :validator="validator">
                  <span class="hidden xl:inline-block">Stake & Manage</span> <span class="xl:hidden">Manage</span>
                </ManageTokensButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
