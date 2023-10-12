<script setup>
  import { computed, ref } from 'vue';
  import { Link, AdminIcon, GovernanceIcon } from '@/components/Ui';

  import { CustomProposalTypes } from '@/domain';
  import { useFeatures } from '@/composables';

  import { CustomProposalTypes as CustomProposalTypesType } from '@/types';

  defineProps({
    type: { type: String, default: undefined },
    subType: { type: String, default: undefined },
  });

  const emit = defineEmits(['update:type', 'update:subType', 'close']);

  const features = useFeatures();
  const customProposalTypes = new CustomProposalTypes(features);

  const selectedProposalType = ref();
  const selectedProposalSubType = ref();

  const customProposalTypesToBeDisplayed = computed(() => {
    if (selectedProposalType.value === CustomProposalTypesType.Governance) {
      return customProposalTypes.allSubTypesFor(selectedProposalType.value);
    }

    return customProposalTypes.all();
  });

  const isSubTypeSelected = computed(() => selectedProposalType.value === CustomProposalTypesType.Governance);

  const select = id => {
    if (customProposalTypes.allIds().includes(id)) {
      selectedProposalType.value = id;

      if (id !== CustomProposalTypesType.Governance) {
        emit('update:type', id);
        emit('update:subType', undefined);
      }
    } else {
      selectedProposalSubType.value = id;
      emit('update:type', selectedProposalType.value);
      emit('update:subType', selectedProposalSubType.value);
    }
  };
</script>

<template>
  <div class="space-y-8">
    <h2 class="title-5">Create Proposal</h2>
    <p class="text-black/60">Please select the type of proposal you'd like to create.</p>
    <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
      <div
        v-for="({ id, label, description }, index) in customProposalTypesToBeDisplayed"
        :key="label"
        :class="[
          index === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
          index === 1 ? 'sm:rounded-tr-lg' : '',
          index === customProposalTypes.length - 2 ? 'sm:rounded-bl-lg' : '',
          index === customProposalTypes.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
          'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
        ]"
      >
        <div>
          <span class="inline-flex rounded-lg p-3 ring-4 ring-white bg-gray-100">
            <AdminIcon class="h-5 w-5 text-gray" aria-hidden="true" v-if="!isSubTypeSelected" />
            <GovernanceIcon class="h-5 w-5 text-gray" aria-hidden="true" v-else />
          </span>
        </div>
        <div class="mt-8">
          <h3>
            <button class="focus:outline-none" @click="select(id)">
              <!-- Extend touch target to entire panel -->
              <span class="absolute inset-0" aria-hidden="true" />
              {{ label }}
            </button>
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            {{ description }}
          </p>
        </div>
        <span class="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
            />
          </svg>
        </span>
      </div>
    </div>
    <Link @click="emit('close')">Cancel</Link>
  </div>
</template>
