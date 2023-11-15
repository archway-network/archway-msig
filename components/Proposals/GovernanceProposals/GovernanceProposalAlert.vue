<script lang="tsx" setup>
  import { AlertBanner } from '@/components/Ui';

  import { useFeatures } from '@/composables';
  import { CustomProposalTypes } from '@/domain';

  defineProps<{ governanceProposalType: string }>();

  const features = useFeatures();
  const customProposalTypes = new CustomProposalTypes(features);
</script>

<template>
  <AlertBanner type="warning">
    {{ customProposalTypes.descriptionFor(governanceProposalType) }}
  </AlertBanner>
</template>
