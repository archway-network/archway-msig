<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import ManageMembersBlock from '@/components/Members/ManageMembersBlock.vue';
  const attr = useAttrs();
</script>

<template>
  <div class="space-y-3">
    <div class="font-medium">Members to update</div>
    <ManageMembersBlock v-bind="attr" />
  </div>
</template>
