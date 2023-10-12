<script lang="tsx" setup>
  import { InformationCircleIcon } from '@heroicons/vue/20/solid';

  import { useFeatures } from '@/composables';
  import { CustomProposalTypes } from '@/domain';

  defineProps<{ governanceProposalType: string }>();

  const features = useFeatures();
  const customProposalTypes = new CustomProposalTypes(features);
</script>

<template>
  <div class="rounded-md bg-yellow/10 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <InformationCircleIcon class="h-5 w-5 text-yellow" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <div class="text-sm">
          <p>{{ customProposalTypes.descriptionFor(governanceProposalType) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
