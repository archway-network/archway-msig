<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import ManageStakingValidators from '@/components/Staking/ManageStakingValidators.vue';
  const attr = useAttrs();
</script>

<template>
  <div class="space-y-3">
    <div class="font-medium">Bulk undelegations</div>
    <ManageStakingValidators v-bind="attr" />
  </div>
</template>
