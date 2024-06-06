<script lang="ts" setup>
  import { type PropType } from 'vue';
  import { CopyAddress, TooltipWithIcon } from '@/components/Ui';
  import RemoveMemberButton from '@/components/Members/RemoveMemberButton.vue';
  import { Member } from '@/domain';
  import { formatPercent } from '@/utils';

  const props = defineProps({
    members: { type: Array as PropType<Member[]>, required: true },
  });

  const totalVotingPower = computed(() => {
    return props.members.reduce((acc, member) => acc + member.weight, 0);
  });
</script>

<template>
  <table class="min-w-full border-separate border-spacing-0">
    <thead>
      <tr>
        <th
          scope="col"
          class="sticky top-0 z-10 border-b border-gray-warm bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left caption font-medium text-gray-800 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
        >
          Member
        </th>
        <th
          scope="col"
          class="sticky top-0 z-10 w-[200px] border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-center caption font-medium text-gray-800 backdrop-blur backdrop-filter"
        >
          <TooltipWithIcon text="Voting Power bla bla bla " width="200px"> Voting Power </TooltipWithIcon>
        </th>
        <th
          scope="col"
          class="sticky top-0 z-10 w-[200px] border-b border-gray-warm bg-white bg-opacity-75 px-3 py-3.5 text-center caption font-medium text-gray-800 backdrop-blur backdrop-filter"
        >
          <TooltipWithIcon text="Voting Weight bla bla bla " width="200px"> Voting Weight </TooltipWithIcon>
        </th>
        <th
          scope="col"
          class="sticky top-0 z-10 w-[200px] border-b border-gray-warm bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
        >
          <span class="sr-only">Remove</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in members">
        <td class="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
          <CopyAddress :address="member.addr" />
        </td>
        <td class="whitespace-nowrap w-[200px] px-3 py-4 text-center">{{ formatPercent((member.weight / totalVotingPower) * 100) }}</td>
        <td class="whitespace-nowrap w-[200px] px-3 py-4 text-center">{{ member.weight }}</td>
        <td class="relative whitespace-nowrap w-[200px] py-4 pr-4 pl-3 text-right sm:pr-8 lg:pr-8">
          <RemoveMemberButton :member="member" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
